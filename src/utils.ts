import { ConfigManager as ConfMan } from "./ConfigManager";
import { client as discordClient } from "./DiscordManager";
import { TextChannel, MessageEmbed } from "discord.js";
import { afklist } from "./MinecraftManager";
import { GuildMemberRoleManager, GuildMember} from "discord.js";

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
