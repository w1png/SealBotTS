import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client as discordClient } from "../DiscordManager";
import { startedTime } from "../index";
import { exec } from "child_process";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Bot latency");

async function getHypixelPing(): Promise<string | undefined>{
  return new Promise((resolve, reject) => {
    exec("echo \"$(ping -c 1 'mc.hypixel.net')\"", (error, stdout, stderr) => {
      if (error || stderr) resolve(undefined);
      resolve(stdout.split("\n")[1].split("time=").at(-1));
    });
  });
}

function getUptime(): string {
  let upTime = Date.now() - startedTime;
  return `${Math.floor(upTime / 8640000)}d ${Math.floor(upTime / 360000)}h ${Math.floor(upTime / 60000)}m ${Math.floor(upTime / 1000)}s`;
}

export async function execute(interaction: CommandInteraction) {
  let embed = new MessageEmbed()
    .setTitle("Pong! System stats:")
    .setFields(
      { name: "Hypixel", value: `**${await getHypixelPing()}**`, inline: true },
      { name: "Discord API", value: `**${discordClient.ws.ping} ms.**`, inline: true },
      { name: "Uptime", value: getUptime() },
      { name: "Ram usage", value: `${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}mb` }
    )
    .setTimestamp(Date.now());
    
  return interaction.reply({ embeds: [embed] });
}

