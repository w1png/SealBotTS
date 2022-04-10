import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, GuildMember } from "discord.js";
import { getLoadingEmbed, getGuildMemberUsernameList, doesMemberHaveRole, getNoPermissionEmbed, getUnexpectedErrorEmbed } from "../utils";
import { getUserByMinecraftUsername } from "../UserManager";
import ConfMan from "../ConfigManager";

const ConfigManager = new ConfMan();

export const data = new SlashCommandBuilder()
  .setName("unverifiedlist")
  .setDescription("(STAFF ONLY) get guild members that were not verified yet");


export async function execute(interaction: CommandInteraction) {
  if(!(doesMemberHaveRole((interaction.member as GuildMember), ConfigManager.roles["bot-access"]) || !(interaction.member as GuildMember).permissions.has("ADMINISTRATOR")))
    return interaction.reply({embeds: [getNoPermissionEmbed()], ephemeral: true});


  interaction.reply({
    embeds: [getLoadingEmbed()],
    ephemeral: true
  });

  getGuildMemberUsernameList().then(async (guildMemberList) => {
    if(!guildMemberList) return interaction.reply({
      embeds: [new MessageEmbed().setTitle("Everyone is verified!").setDescription("Great job! Everyone is already verified!")]
    });

    let desc = "";

    for (let member of guildMemberList) 
      if (!(await getUserByMinecraftUsername(member))) 
        desc += member + "\n";
    
    return interaction.editReply({
      embeds: [new MessageEmbed().setTitle("Unverified users:").setDescription(desc)],
    });
  }).catch(() => {
    interaction.editReply({
      embeds: [getUnexpectedErrorEmbed()]
    })
  });
}

