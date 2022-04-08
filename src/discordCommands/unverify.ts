import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { doesMemberHaveRole, removeRole } from "../utils";
import { ConsoleLogger as ConsLog } from "../ConsoleLogger";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { removeUser } from "../UserManager";

const ConfigManager = new ConfMan("config.json");
const ConsoleLogger = new ConsLog();

export const data = new SlashCommandBuilder()
  .setName("unverify")
  .setDescription("get rid of the Member role")
  .addUserOption((option) => 
    option.setName("user").setDescription("(STAFF ONLY)  @discord user"));

function getAlreadyVerifiedEmbed(username: string): MessageEmbed {
  return new MessageEmbed()
          .setTitle(`${username} is already not verified!`)
          .setDescription("They can verify by using the /verify command!")
          .setColor("RED")
}

function getUnverifiedEmbed(username: string) {
  return new MessageEmbed()
          .setTitle(`${username} is not verified now!`)
          .setDescription("They can verify again by using the /verify command!")
}

export async function execute(interaction: CommandInteraction) {
  let member: GuildMember = ((interaction.member as GuildMember).permissions.has("ADMINISTRATOR") && interaction.options.getUser("user")) ? (interaction.guild?.members.cache.get(interaction.options.getUser("user")!.id) as GuildMember): (interaction.member as GuildMember);

  let isMember = doesMemberHaveRole(member, ConfigManager.roles["member"]); 
  if (isMember) {
    removeRole(member, ConfigManager.roles["member"]);
    removeUser(member.id);

    ConsoleLogger.log(`${member.toString()} is not verified now.`);
  }

  return interaction.reply({
    embeds: [isMember ? getUnverifiedEmbed(member.user.username): getAlreadyVerifiedEmbed(member.user.username)],
    ephemeral: true
  });
}

