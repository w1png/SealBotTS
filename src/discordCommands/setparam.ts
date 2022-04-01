import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { ConfigManager as ConfMan } from "../ConfigManager";
import { getNoPermissionEmbed, doesMemberHaveRole } from "../utils";

const ConfigManager = new ConfMan("config.json");

export const data = new SlashCommandBuilder()
  .setName("setparam")
  .setDescription("(STAFF ONLY) change the bot's config")
  .addStringOption((option) =>
    option.setName("parameter").setDescription("The parameter you want to change").setRequired(true),
  )
  .addStringOption((option) => 
    option.setName("value").setDescription("The value of the parameter").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  if (!doesMemberHaveRole((interaction.member as GuildMember), ConfigManager.roles["bot-access"]))
    return interaction.reply({
      embeds: [getNoPermissionEmbed()],
      ephemeral: true,
    });

  const param = interaction.options.getString("parameter")!;
  const value = interaction.options.getString("value")!;

  if (!(param in ConfigManager.config))
    return interaction.reply({
      embeds: [new MessageEmbed().setTitle(`Parameter doesn't exist!`).setFields({name: `Parameter **${param}** does not exist in config.json!`, value:`You can see the contents of the config file using the /viewconfig command.`})],
      ephemeral: true,
    });

  ConfigManager.writeConfig(param, value);
  return interaction.reply("config.json was updated!");
}

