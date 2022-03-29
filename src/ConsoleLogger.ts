import {ConfigManager as ConfMan } from "./ConfigManager";
import { sendEmbedToChannel, sendTextToChannel } from "./utils";
import { MessageEmbed } from "discord.js";
import { roles } from "./index";

let ConfigManager = new ConfMan("config.json");

const WARN = "#FFCC00";
const ERROR = "RED";

export class ConsoleLogger {
  logError(message: string): void {
    sendEmbedToChannel(
      ConfigManager.config["discord-console-channel"], 
      new MessageEmbed()
        .setTitle("Error!")
        .setDescription(message + `\n<@&${roles.get("dev-team")}>`)
        .setColor(ERROR)
    );
  }

  logWarn(message: string): void {
     sendEmbedToChannel(
      ConfigManager.config["discord-console-channel"], 
      new MessageEmbed()
        .setTitle("Warning!")
        .setDescription(message + `\n<@&${roles.get("dev-team")}>`)
        .setColor(WARN)
    );
  }

  log(message: string): void {
    sendTextToChannel(ConfigManager.config["discord-console-channel"], message); 
  }
}

