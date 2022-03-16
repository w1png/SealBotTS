import { SlashCommandBuilder } from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("command_description");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("reply_text");
}
