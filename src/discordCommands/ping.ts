import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client as discordClient } from "../DiscordManager";
import { getHypixelPing, getUptime } from "../utils";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Bot latency");

export async function execute(interaction: CommandInteraction) {
  let embed = new MessageEmbed()
    .setTitle("Pong! System stats:")
    .setFields(
      { name: "Hypixel", value: `**${await getHypixelPing()}**`, inline: true },
      { name: "Discord API", value: `**${discordClient.ws.ping} ms.**`, inline: true },
      { name: "Uptime", value: getUptime() },
      { name: "Ram usage", value: `${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb` }
    )
    .setTimestamp(Date.now());
    
  return interaction.reply({ embeds: [embed] });
}

