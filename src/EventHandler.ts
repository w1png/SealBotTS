import { MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "./ConfigManager";
import { sendEmbedToChannel } from "./utils";
import { roles } from "./index";
import { ConsoleLogger as ConsLog } from "./ConsoleLogger";

let ConfigManager = new ConfMan("config.json");
let ConsoleLogger = new ConsLog();

function check_jacobs(checked_date: Date): void {
  if (checked_date.getMinutes() == 15) {
    ConsoleLogger.log(`**Discord**: [<#${ConfigManager.config["discord-events-channel"]}>] Jacobs event notification.`);
    return sendEmbedToChannel(
      ConfigManager.config["discord-events-channel"],
      new MessageEmbed()
        .setTitle("Jacobs event soon!")
        .setDescription(`Prepare your hoes! Jacobs event starts in ${ConfigManager.config["notif-time"]} minutes!\n<@&${roles.get("jacobs_ping")}>`)
    );
  }
}

// TODO: rename to handleEvents
export function checkEvents(): void {
  let checked_date = new Date(Date.now() + parseInt(ConfigManager.config["notif-time"]) * 60000); 
  if (ConfigManager.config["jacobs-on"] == "1") check_jacobs(checked_date);
}
