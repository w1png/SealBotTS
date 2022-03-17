import { ConfigManager as ConfMan } from "./ConfigManager";
import { client as discordClient } from "./DiscordManager";
import { TextChannel, MessageEmbed } from "discord.js";

export function sendTextToChannel(channelId: string, text: string): void {
    (discordClient.channels.cache.get(channelId) as TextChannel).send(text);
}

export function sendEmbedToChannel(channelId: string, embed: MessageEmbed): void {
    (discordClient.channels.cache.get(channelId) as TextChannel).send({ embeds: [embed] });
}


