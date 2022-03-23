import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Bot latency");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(((Math.random() * (1 - 0)) == 1) ? "The coin landed tails!": "The coins landed heads!");
}

