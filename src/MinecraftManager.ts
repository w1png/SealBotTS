import * as minecraftProtocol from "minecraft-protocol";
import * as commandModules from "./minecraftCommands";
import ConfMan from "./ConfigManager";
import { ColorResolvable, MessageEmbed } from "discord.js";
import * as utils from "./utils";
import { client as discordClient } from "./DiscordManager";
import * as Hypixel from "hypixel-api-reborn";
import { getUserByMinecraftUsername } from "./UserManager";
import { ConsoleLogger as ConsLog } from "./ConsoleLogger";

const commands = Object(commandModules);
const ConfigManager = new ConfMan();
const ConsoleLogger = new ConsLog();
export const hypixel = new Hypixel.Client(ConfigManager.config["hypixel-token"]);


// managing afking
export interface afker {
  username: string,
  time: number
}

export let afklist: Array<afker> = [];

// Those functions had to be created because of the spam prevention system in hypixel. It allows you to send the same message every 4 messages so we iterate through 4 different messages
let spamPreventionIter = 0;
export function getSpamPreventionIter() {
  spamPreventionIter = (spamPreventionIter == 3) ? 0: spamPreventionIter + 1;
  return spamPreventionIter;
}

export const AFK_TEXT: Array<string> = [
  " is now afk!",
  " is away from keyboard!",
  " is going to be afk for some time!",
  " is away now!",
  " is afking now!"
]

export const NOT_AFK_TEXT: Array<string> = [
  " is not afk anymore!",
  " is near the computer again!",
  " is not away from keyboard anymore!",
  " is not afk!",
  " is no longer an afker!"
]

export const NO_AFK_TEXT: Array<string> = [
  "There are no people afking right now!",
  "There is no one afk now!",
  "The afk list is empty!",
  "No one is afk at the moment!",
  "There are no afkers right now!"
]

export async function getPingTextList(): Promise<Array<string>> {
  return new Promise(async (resolve, reject) => {
    try {
      resolve([
        `/gc DiscordAPI: ${discordClient.ws.ping} ms.; Hypixel: ${await utils.getHypixelPing()}; RAM: ${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb`,
        `/gc Hypixel: ${await utils.getHypixelPing()}; DiscordAPI: ${discordClient.ws.ping} ms.; RAM: ${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb`,
        `/gc RAM: ${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb; Hypixel: ${await utils.getHypixelPing()}; DiscordAPI: ${discordClient.ws.ping} ms. `,
        `/gc DiscordAPI: ${discordClient.ws.ping} ms.; RAM: ${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb; Hypixel: ${await utils.getHypixelPing()}`
      ]);
    } catch {
      reject(undefined);
    }
  });
}

export var client = minecraftProtocol.createClient({
  host: ConfigManager.config["minecraft-server"],
  username: ConfigManager.config["minecraft-email"],
  auth: "microsoft",
  version: "1.8.9",
});

function removeColors(text: string): string {
  return text.replace(/\u00A7[0-9A-FK-OR]/gi, "");
}

function removeRanks(text: string): string {
  return text.replace(/ *\[[^\]]*]/, "");
}

function removeSpaces(text: string): string {
  return text.replace(/\s+/g,"");
}

export function sendToMinecraft(text: string): void {
  client.write("chat", { message: text });
}

client.on("connect", async () => {
  console.log("Minecraft client started!");
  await new Promise(r => setTimeout(r, 5000));
  console.log("Sending to skyblock");
  sendToMinecraft("/skyblock");
  await new Promise(r => setTimeout(r, 5000));
  console.log("Sending to personal island");
  sendToMinecraft("/is");
});


client.on("chat", async function (packet: any) {
  var msg = JSON.parse(packet.message);
  var username: string;
  var text: string;
  var color: ColorResolvable;
  
  try {
    // leave/join messages
    if (msg.text == "Guild > ") {
      username = msg.extra[0].text.slice(0, -1);
      text = msg.extra[1].text;
      color = text.endsWith("joined.") ? "GREEN" : "RED";
      if (text.endsWith("left.") && utils.getAfkUsernames().includes(username)) utils.removeFromAfkList(username);

      utils.sendEmbedToChannel(
        ConfigManager.config["discord-bridge-channel"],
        new MessageEmbed()
          .setAuthor(`${username} ${text}`, "https://www.mc-heads.net/avatar/" + username)
          .setTimestamp()
          .setColor(color)
      );
    } else if (msg.text == "") {
      // strip colors and spaces from username and text
      username = removeColors(msg.extra[0].text).replace(/ /g, "");
      text = removeColors(msg.extra[1].text);

      // if guild chat
      if (username.startsWith("Guild>") || username.startsWith("Officer>")) {
        var targetChannelId = (username.startsWith("Guild>")) ? ConfigManager.config["discord-bridge-channel"]: ConfigManager.config["discord-officer-channel"];

        // remove ranks from username to get plain username
        username = removeRanks(username.slice((username.startsWith("Guild>") ? 6: 8)).slice(0, -1).split("[").join(" ["));

        // dont parse own messages
        if (username.startsWith(ConfigManager.config["minecraft-username"] + "[")) return;

        // Commands
        if (text.startsWith("!")) {
          let command = text.slice(1).split(" ")[0];
          let args = text.split(" ").slice(1);
          commands[command].execute(username, args);
        }

        // send to bridge chat if not a command
        return utils.sendEmbedToChannel(
          targetChannelId,
          new MessageEmbed()
            .setAuthor(username, "https://www.mc-heads.net/avatar/" + username.split(" ")[0])
            .setDescription(text)
            .setColor("#ADD8E6")
            .setTimestamp()
        );
      }
    } else if ((msg.extra[0].text.startsWith("was promoted") || msg.extra[0].text.startsWith("was demoted")) || (Object.keys(msg.extra).length > 1 && ((msg.extra.at(-1).text.startsWith("was promoted") || msg.extra.at(-1).text.startsWith("was demoted"))))) {
      let username = removeRanks(msg.text);
      let roleText = msg.extra[0].text;

      if (Object.keys(msg.extra).length > 1) {
        roleText = msg.extra.at(-1).text;
        
        username = msg.text;
        for (let ex of msg.extra.slice(0, -1)) {
          username += ex.text;
        }
        username = removeRanks(username); 
      }
      username = removeSpaces(username);

      getUserByMinecraftUsername(username)
        .then(async (user) => {
	  if (!user) return;
          
          ConsoleLogger.log(`**Minecraft**: ${username} (<@${await getUserByMinecraftUsername(username)}>) ${roleText}`);

          let roleAdded = ConfigManager.roles[roleText.split(" to ")[1].toLowerCase()];
          let roleRemoved = ConfigManager.roles[roleText.split(" to ")[0].split(" ").at(-1).toLowerCase()];

          if (roleAdded == ConfigManager.roles["member"]) {
            return utils.removeRole(await discordClient.guilds.cache.get(ConfigManager.config["discord-guild"])?.members.fetch(user.discord_id)!, roleRemoved); 
          } else if (roleRemoved == ConfigManager.roles["member"]) {
            return utils.addRole(await discordClient.guilds.cache.get(ConfigManager.config["discord-guild"])?.members.fetch(user.discord_id)!, roleAdded);
          }

          utils.removeRole(await discordClient.guilds.cache.get(ConfigManager.config["discord-guild"])?.members.fetch(user.discord_id)!, roleRemoved);
          utils.addRole(await discordClient.guilds.cache.get(ConfigManager.config["discord-guild"])?.members.fetch(user.discord_id)!, roleAdded);
        }).catch(() => {return});
   }
  } catch {}
});

