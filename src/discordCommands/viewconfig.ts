import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, GuildMemberRoleManager } from "discord.js";
import * as fs from "fs";
import { roles } from "../index";
import { ConfigManager as ConfMan } from "../ConfigManager";

const ConfigManger = new ConfMan("../../config.json");

export const data = new SlashCommandBuilder()
  .setName("viewconfig") 
  .setDescription("(STAFF ONLY) Allows you to see the bot's config");

export async function execute(interaction: CommandInteraction) {
  if (!((interaction.member.roles as GuildMemberRoleManager).cache.some((role) => role.id == roles.get("bot_access"))))
    return interaction.reply({
      embeds: [new MessageEmbed().setTitle("You can not use that!").setDescription("Only staff can use this command!").setColor("RED")]
    })
  return interaction.reply("**Contents of *config.ini*:**\n```json\n" + ConfigManger.getRawConfig() + "\n```"); 
}
