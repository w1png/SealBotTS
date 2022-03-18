import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, TextChannel } from "discord.js";
import { sendToMinecraft } from "../MinecraftManager";

export const data = new SlashCommandBuilder()
  .setName("party")
  .setDescription("Party someone on hypixel")
  .addStringOption((option) =>
    option.setName("ign").setDescription("Your minecraft ign").setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction?.channelId) return;
  const channel = await client.channels.fetch(interaction.channelId);
  
  if (!channel || channel.type != "GUILD_TEXT") return;

  const ign = interaction.options.getString("ign")!;
  sendToMinecraft("ign");

  interaction.reply({
    content: `Party request was sent to ${ign}!`,
    ephemeral: true,
  });
}
