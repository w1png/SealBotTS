import * as minecraftProtocol from "minecraft-protocol";
import * as commandModules from "./minecraftCommands";
import { ConfigManager as ConfMan } from "./ConfigManager";
import { ColorResolvable, MessageEmbed } from "discord.js";
import * as utils from "./utils";
import { ConsoleLogger as ConsLog } from "./ConsoleLogger";

const commands = Object(commandModules);
const ConfigManager = new ConfMan("config.json");
const ConsoleLogger = new ConsLog();

// managing afking
export interface afker {
  username: string,
  time: number
}

export let afklist: Array<afker> = [];

// Those functions had to be created because of the spam prevention system in hypixel. It allows you to send the same message every 4 messages so we iterate through 4 different messages
// TODO: refactor
const AFK_TEXT: Array<string> = [
  " is now afk!",
  " is away from keyboard!",
  " is going to be afk for some time!",
  " is away now!",
  " is afking now!"
]
let afkIter: number = 0;
export function getAfkText(): string {
  afkIter = (afkIter == 4) ? 0: afkIter + 1;
  return AFK_TEXT[afkIter];
}

const NOT_AFK_TEXT: Array<string> = [
  " is not afk anymore!",
  " is near the computer again!",
  " is not away from keyboard anymore!",
  " is not afk!",
  " is no longer an afker!"
]
let notAfkIter: number = 0;
export function getNotAfkText(): string {
  notAfkIter = (notAfkIter == 4) ? 0: notAfkIter + 1;
  return NOT_AFK_TEXT[notAfkIter];
}

const NO_AFK_TEXT: Array<string> = [
  "There are no people afking right now!",
  "There is no one afk now!",
  "The afk list is empty!",
  "No one is afk at the moment!",
  "There are no afkers right now!"
]
let noAfkIter: number = 0;
export function getNoAfkText(): string {
  noAfkIter = (noAfkIter == 4) ? 0: noAfkIter + 1;
  return NO_AFK_TEXT[noAfkIter];
}

export var client = minecraftProtocol.createClient({
  host: ConfigManager.config["minecraft-server"],
  username: ConfigManager.config["minecraft-email"],
  password: ConfigManager.config["minecraft-password"],
  auth: "microsoft",
  version: "1.8.9",
});

function removeColors(text: string): string {
  return text.replace(/\u00A7[0-9A-FK-OR]/gi, "");
}

// TODO: remove rank not ranks
function removeRanks(text: string): string {
  return text.replace(/ *\[[^\]]*]/g, "");
}

export function sendToMinecraft(text: string): void {
  client.write("chat", { message: text });
}


client.on("connect", () => console.log("Minecraft client started!"));


client.on("chat", function (packet: any) {
  var msg = JSON.parse(packet.message);
  var username: string;
  var text: string;
  var color: ColorResolvable;

  try {
    // leave/join messages
    if (msg.text == "Guild > ") {
      username = msg.extra[0].text;
      text = msg.extra[1].text;
      color = text.endsWith("joined.") ? "GREEN" : "RED";

      if (text.endsWith("left.") && utils.getAfkUsernames().includes(username)) utils.removeFromAfkList(username);

      ConsoleLogger.log(`**Minecraft**: ${username} ${text}`);
      utils.sendEmbedToChannel(
        ConfigManager.config["discord-bridge-channel"],
        new MessageEmbed()
          .setAuthor(`${username} ${text}`, "https://www.mc-heads.net/avatar/" + username)
          .setTimestamp()
          .setColor(color)
      );
    }else if (msg.text == "") {
      // strip colors and spaces from username and text
      username = removeColors(msg.extra[0].text).replace(/ /g, "");
      text = removeColors(msg.extra[1].text);

      // if guild chat
      if (username.startsWith("Guild>") || username.startsWith("Officer>")) {
        var targetChannelId = (username.startsWith("Guild>")) ? ConfigManager.config["discord-bridge-channel"]: ConfigManager.config["discord-officer-channel"];

        // remove ranks from username to get plain username
        username = removeRanks(username.slice((username.startsWith("Guild>") ? 6: 8)).slice(0, -1));
        ConsoleLogger.log(`**Minecraft**: [<#${targetChannelId}>] -> ${username} ${text}`); 

        // dont parse own messages
        if (username == ConfigManager.config["minecraft-username"]) return;

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
            .setAuthor(username, "https://www.mc-heads.net/avatar/" + username)
            .setDescription(text)
            .setColor("#ADD8E6")
            .setTimestamp()
        );
      }
    }
  } catch {}
});

