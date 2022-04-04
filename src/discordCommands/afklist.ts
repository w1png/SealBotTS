import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { afklist } from "../MinecraftManager";

const ConfigManager = new ConfMan("config.json");

export const data = new SlashCommandBuilder()
  .setName("afklist")
  .setDescription("See people afking.");

function getAfklistEmbed(): MessageEmbed {
  if (afklist.length == 0)
    return new MessageEmbed().setTitle("There are no people afking right now!");

  let description = "";
  afklist.forEach((player: any) => {
    let time: string;
    if (Date.now() - player.time >= 60000) {
      time = `${Math.floor((Date.now() - player.time) / 60000)} minutes`;
    } else {
      time = `${Math.floor((Date.now() - player.time) / 1000)} seconds`;
    }
    description += `${player.username}: ${time}\n`;
  });

  return new MessageEmbed()
    .setTitle(`There are ${afklist.length} people afking right now.`)
    .setDescription(description);
}

export async function execute(interaction: CommandInteraction) {
  return interaction.reply({
    embeds: [getAfklistEmbed()],
    ephemeral: [ConfigManager.config["discord-bridge-channel"], ConfigManager.config["discord-officer-channel"]].includes(interaction.channelId),
  });
}
