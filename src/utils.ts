import ConfMan from "./ConfigManager";
import { client as discordClient } from "./DiscordManager";
import { TextChannel, MessageEmbed, RoleResolvable } from "discord.js";
import { afklist } from "./MinecraftManager";
import { GuildMemberRoleManager, GuildMember} from "discord.js";
import { fetchJson } from "fetch-json";
import { hypixel } from "./MinecraftManager";
import { startedTime } from "./index";
import { exec } from "child_process";

const ConfigManager = new ConfMan();

export function sendTextToChannel(channelId: string, text: string): void {
  (discordClient.channels.cache.get(channelId) as TextChannel).send(text);
}

export function sendEmbedToChannel(channelId: string, embed: MessageEmbed): void {
  (discordClient.channels.cache.get(channelId) as TextChannel).send({ embeds: [embed] });
}

export function getAfkUsernames(): Array<string> {
  let afkUsernames: Array<string> = [];
  for (let player of afklist) afkUsernames.push(player.username);
  return afkUsernames; 
}

export function removeFromAfkList(username: string): void {
  for (let user of afklist) 
    if (user.username == username) afklist.splice(afklist.indexOf(user), 1);
}

export function doesMemberHaveRole(member: GuildMember, role_id: string | undefined): boolean {
  return (member.roles as GuildMemberRoleManager).cache.some((role) => role.id == role_id);
}

export function addRole(member: GuildMember, role_id: string | undefined): void {
  member.roles.add((member.guild.roles.cache.find(role => role.id === role_id) as RoleResolvable));
}

export function removeRole(member: GuildMember, role_id: string | undefined): void {
    member.roles.remove((member.guild.roles.cache.find(role => role.id === role_id) as RoleResolvable));
}

export function getNoPermissionEmbed(): MessageEmbed {
  return new MessageEmbed().setTitle("You can not use that!").setDescription("Only staff can use this command!").setColor("RED");
}

export function getLoadingEmbed(): MessageEmbed {
  return new MessageEmbed().setTitle("Loading...").setDescription("Please wait for this command to finish processing.\nThis usually takes up to a minute.").setColor("AQUA");
}

export async function timeout(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUsernameFromUUID(uuid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetchJson.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`).then((response: any) => {
      resolve(response.name);
    });
  });
}

export async function getGuildMemberUsernameList(): Promise<Array<string>> {
  return new Promise(async (resolve) => {
    let guildMemberList = await hypixel.getGuild("id", ConfigManager.config["hypixel-guild"], {}).then((guild) => {return guild.members}); 
    var guildMemberUsernameList = Array<string>();

    for (let member of guildMemberList) 
      guildMemberUsernameList.push(await getUsernameFromUUID(member.uuid));

    resolve(guildMemberUsernameList);
  });
}

export async function getHypixelPing(): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    exec("echo \"$(ping -c 1 'mc.hypixel.net')\"", (error, stdout, stderr) => {
      if (error || stderr) resolve(undefined);
      resolve(stdout.split("\n")[1].split("time=").at(-1));
    });
  });
}

export function getUptime(): string {
  let upTime = Date.now() - startedTime;
  return `${Math.floor(upTime / 86400000)}d ${Math.floor(upTime / 3600000) % 24}h ${Math.floor(upTime / 60000) % 60}m ${Math.floor(upTime / 1000) % 60}s`;
}

export function getUnexpectedErrorEmbed(): MessageEmbed {
  return new MessageEmbed().setTitle("An unexpected error occured!").setDescription(`Please contact <@&${ConfigManager.roles["dev-team"]} if you think this wasn't supposed to happen.>`).setColor("RED");
}

export function runAfkPreventionCommands(): void {
  let functions = [
    "/lobby",
    "/skyblock",
    "/is"
  ]
  for (let command of functions) {
    sendToMinecraft(command);
    timeout(1000); 
  }
}

