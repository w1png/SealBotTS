import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, GuildMember } from "discord.js";
import { getUsers } from "../UserManager";
import { doesMemberHaveRole, getNoPermissionEmbed } from "../utils";
import { ConfigManager as ConfMan } from "../ConfigManager"; 

const ConfigManager = new ConfMan();

export const data = new SlashCommandBuilder()
  .setName("verifiedlist")
  .setDescription("(STAFF ONLY) get all the verified user");

export async function execute(interaction: CommandInteraction) {
  if(!(doesMemberHaveRole((interaction.member as GuildMember), ConfigManager.roles["bot-access"]) || !(interaction.member as GuildMember).permissions.has("ADMINISTRATOR")))
    return interaction.reply({embeds: [getNoPermissionEmbed()], ephemeral: true});

  getUsers().then((userList) => {
    if (userList.length == 0)
      return interaction.reply({
        embeds: [new MessageEmbed().setTitle("There are no verified player.").setDescription("You can verify by using /verify")],
        ephemeral: true
      });
    
    let desc = "";
    for (let user of userList) {
      desc += `<@${user.discord_id}>: ${user.username}\n`;
    }
    return interaction.reply({embeds: [new MessageEmbed().setTitle("Verified players").setDescription(desc)]});
  }); 
}

