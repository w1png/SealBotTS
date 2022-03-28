import { CommandInteraction, GuildMember, MessageEmbed, RoleResolvable } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { doesMemberHaveRole } from "../utils";
import { roles } from "../index";
import { ConsoleLogger as ConsLog } from "../ConsoleLogger";
import { ConfigManager as ConfMan } from "../ConfigManager";

const ConfigManager = new ConfMan("config.json");
const ConsoleLogger = new ConsLog();

export const data = new SlashCommandBuilder()
  .setName("unverify")
  .setDescription("get rid of the Member role")
  .addUserOption((option) => 
    option.setName("user").setDescription("(STAFF ONLY)  @discord user"));

// TODO: refactor
export async function execute(interaction: CommandInteraction) {
  if ((interaction.member as GuildMember).permissions.has("ADMINISTRATOR") && interaction.options.getUser("user")) {
    let user = interaction.options.getUser("user")!;
    
    if (!doesMemberHaveRole((interaction.guild?.members.cache.get(user.id) as GuildMember), roles.get("member"))) 
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.username} is already not verified!`)
            .setDescription("They can verify by using the /verify command!")
            .setColor("RED")
        ],
        ephemeral: true
      });

    (interaction.guild?.members.cache.get(user.id) as GuildMember).roles.remove(((interaction.guild?.members.cache.get(user.id) as GuildMember).guild.roles.cache.find(role => role.id === roles.get("member")) as RoleResolvable));
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${user.username} is not verified now!`)
          .setDescription("They can verify again by using the /verify command!")
      ],
      ephemeral: true
    });
  }
  
  if (!doesMemberHaveRole((interaction.member as GuildMember), roles.get("member"))) 
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("You are already not verified!")
          .setDescription("You can verify by using the /verify command!")
          .setColor("RED")
      ],
      ephemeral: true
    });

  (interaction.member as GuildMember).roles.remove(((interaction.member as GuildMember).guild.roles.cache.find(role => role.id === roles.get("member")) as RoleResolvable));
  return interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("You are not verified now!")
        .setDescription("You can verify again by using the /verify command!")
    ],
    ephemeral: true
  });
}
