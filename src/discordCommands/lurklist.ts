import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { lurklist } from "../index";

const ConfigManager = new ConfMan("config.json");

export const data = new SlashCommandBuilder()
  .setName("lurklist")
  .setDescription("See people lurking.");

function getLurklistEmbed(): MessageEmbed {
  if (lurklist.length == 0)
    return new MessageEmbed().setTitle("There are no people lurking right now!");


  let description = "";
  lurklist.forEach((player: any) => {
    let time: string;
    if (Date.now() - player[1] >= 60000) {
      time = `${Math.floor((Date.now() - player[1]) / 60000)} minutes`;
    } else {
      time = `${Math.floor((Date.now() - player[1]) / 1000)} seconds`;
    }
    description += `${player[0]}: ${time}\n`;
  });

  return new MessageEmbed()
    .setTitle(`There are ${lurklist.length} people lurking right now.`)
    .setDescription(description);
}

export async function execute(interaction: CommandInteraction) {
  return interaction.reply({
    embeds: [getLurklistEmbed()],
    ephemeral:
      interaction.channelId == ConfigManager.config["discord-bridge-channel"],
  });
}
