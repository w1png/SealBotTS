import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, GuildMember } from "discord.js";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { doesMemberHaveRole, getNoPermissionEmbed } from "../utils";

const ConfigManger = new ConfMan("config.json");

export const data = new SlashCommandBuilder()
  .setName("viewconfig") 
  .setDescription("(STAFF ONLY) Allows you to see the bot's config");

export async function execute(interaction: CommandInteraction) {
  if (!doesMemberHaveRole((interaction.member as GuildMember), ConfigManger.roles["bot-access"]))
    return interaction.reply({
      embeds: [getNoPermissionEmbed()],
      ephemeral: true
    });
   
  return interaction.reply("**Contents of *config.json*:**\n```json\n" + ConfigManger.getRawConfig() + "\n```"); 
}
