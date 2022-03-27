import { MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "./ConfigManager";
import { sendEmbedToChannel } from "./utils";
import { roles } from "./index";

let ConfigManager = new ConfMan("config.json");

function check_jacobs(checked_date: Date): void {
  if (checked_date.getMinutes() == 15) {
    return sendEmbedToChannel(
      ConfigManager.config["discord-events-channel"],
      new MessageEmbed()
        .setTitle("Jacobs event soon!")
        .setDescription(`Prepare your hoes! Jacobs event starts in ${ConfigManager.config["notif-time"]} minutes!\n<@&${roles.get("jacobs_ping")}>`)
    );
  }
}

export function checkEvents() {
  let checked_date = new Date(Date.now() + parseInt(ConfigManager.config["notif-time"]) * 60000); 
  if (ConfigManager.config["jacobs-on"] == "1") check_jacobs(checked_date);
}