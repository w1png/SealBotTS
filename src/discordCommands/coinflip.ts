import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("flip a coin!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(((Math.random() * (1 - 0) > 0.5) ? "The coin landed tails!": "The coin landed heads!"));
}

