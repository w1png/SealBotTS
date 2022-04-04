import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { UserManager as UserMan } from "../UserManager";
import { doesMemberHaveRole, addRole } from "../utils";
import * as Hypixel from "hypixel-api-reborn";
import { ConsoleLogger as ConsLog } from "../ConsoleLogger";

const ConfigManager = new ConfMan();
const UserManager = new UserMan();
const hypixel = new Hypixel.Client(ConfigManager.config["hypixel-token"]);
const ConsoleLogger = new ConsLog();

export const data = new SlashCommandBuilder()
  .setName("verify")
  .setDescription("verify that you are a guild member")
  .addStringOption((option) => 
    option.setName("username").setDescription("your hypixel username").setRequired(true)
  );

function sendVerificationError(interaction: CommandInteraction, description: string): void {
  interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Verification error!")
        .setDescription(description)
        .setColor("RED")
    ],
    ephemeral: true
  });
}

export async function execute(interaction: CommandInteraction) {
  if (doesMemberHaveRole((interaction.member as GuildMember), ConfigManager.roles["member"])) {
    return sendVerificationError(interaction, "You are already verified! You can use /unverify to change your account!")
  }

  const username = interaction.options.getString("username")!;

  try {
    const player_guild = await hypixel.getGuild('player', username, {});
 
    if (!player_guild)
      return sendVerificationError(interaction, `${username} is not in a hypixel guild!`);
  
    if (!(player_guild.id == ConfigManager.config["hypixel-guild"]))
      return sendVerificationError(interaction, `${username} is not a part of our hypixel guild!`)
  
    var player = await hypixel.getPlayer(username);
  } catch {
    return sendVerificationError(interaction, `Player "${username}" does not exist!`);
  } 

  for (let social of player.socialMedia) {
    if (social.id == "DISCORD") {
      if (social.link == interaction.user.tag) {
        addRole((interaction.member as GuildMember), ConfigManager.roles["member"]);
        UserManager.createUser(interaction.user.id, username);
        ConsoleLogger.log(`${interaction.user.tag} has been verified as ${username}`);
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("You have been verified!")
              .setDescription(`Come say hello in <#${ConfigManager.config["discord-bridge-channel"]}>`)
              .setColor("GREEN")
          ],
          ephemeral: true
        });
      }
      return sendVerificationError(interaction, `"${social.link}" does not match "${interaction.user.tag}"!`);
    }
  };
  
  return sendVerificationError(interaction, `Player "${username}" does not have a Discord account linked to their Hypixel account!`);
}

