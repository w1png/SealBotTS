import * as minecraftProtocol from "minecraft-protocol";
import * as commandModules from "./minecraftCommands";
import { ConfigManager as ConfMan } from "./ConfigManager";
import { ColorResolvable, MessageEmbed, TextChannel } from "discord.js";
import * as utils from "./utils";

const commands = Object(commandModules);
const ConfigManager = new ConfMan("config.json");

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

      utils.sendEmbedToChannel(
        ConfigManager.config["discord-bridge-channel"],
        new MessageEmbed()
          .setAuthor(`${username}${text}`, "https://www.mc-heads.net/avatar/" + username)
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

