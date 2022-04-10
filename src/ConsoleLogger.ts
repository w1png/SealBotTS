import ConfMan from "./ConfigManager";
import { sendEmbedToChannel, sendTextToChannel } from "./utils";
import { MessageEmbed } from "discord.js";

let ConfigManager = new ConfMan("config.json");

const WARN = "#FFCC00";
const ERROR = "RED";

export class ConsoleLogger {
  logError(message: string): void {
    sendEmbedToChannel(
      ConfigManager.config["discord-console-channel"], 
      new MessageEmbed()
        .setTitle("Error!")
        .setDescription(message + `\n<@&${ConfigManager.roles["dev-team"]}>`)
        .setColor(ERROR)
    );
  }

  logWarn(message: string): void {
     sendEmbedToChannel(
      ConfigManager.config["discord-console-channel"], 
      new MessageEmbed()
        .setTitle("Warning!")
        .setDescription(message)
        .setColor(WARN)
    );
  }

  log(message: string): void {
    sendTextToChannel(ConfigManager.config["discord-console-channel"], message); 
  }
}

