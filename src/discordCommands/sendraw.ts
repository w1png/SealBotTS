import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import ConfMan from "../ConfigManager";
import { sendToMinecraft } from "../MinecraftManager";
import { doesMemberHaveRole, getNoPermissionEmbed } from "../utils";

let ConfigManager = new ConfMan("config.json");

export const data = new SlashCommandBuilder()
  .setName("sendraw")
  .setDescription("send a chat message to hypixel")
  .addStringOption((option) =>
    option.setName("text").setDescription("Text you want to send").setRequired(true)
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!doesMemberHaveRole((interaction.member as GuildMember), ConfigManager.roles["bot-access"])) 
    return interaction.reply({
      embeds: [getNoPermissionEmbed()],
      ephemeral: true
    });

  if (!interaction?.channelId) return;
  const channel = await client.channels.fetch(interaction.channelId);
  
  if (!channel || channel.type != "GUILD_TEXT") return;

  const text = interaction.options.getString("text")!;
  sendToMinecraft(text);

  interaction.reply({
    content: `"${text}" was sent to minecraft chat!`,
    ephemeral: [ConfigManager.config["discord-bridge-channel"], ConfigManager.config["discord-officer-channel"]].includes(interaction.channelId)
  });
}

