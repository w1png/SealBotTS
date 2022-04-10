import { sendToMinecraft } from "../MinecraftManager";
import { afklist, NOT_AFK_TEXT, AFK_TEXT, getSpamPreventionIter, afker } from "../MinecraftManager"
import { sendEmbedToChannel , removeFromAfkList, getAfkUsernames } from "../utils";
import { MessageEmbed } from "discord.js";
import ConfMan from "../ConfigManager";

const ConfigManager = new ConfMan();

export function execute(username: string, args: Array<string>): void {
  let text: string;

  if (getAfkUsernames().includes(username)) {
    removeFromAfkList(username);

    text = NOT_AFK_TEXT[getSpamPreventionIter()];
    sendEmbedToChannel(
    ConfigManager.config["discord-bridge-channel"],
      new MessageEmbed()
        .setAuthor(`${username} ${text}`, "https://www.mc-heads.net/avatar/" + username)
        .setTimestamp()
    );
    return sendToMinecraft(`${username}${text}`);
  }
  
  let user: afker = {
    username: username,
    time: Date.now()
  }
  afklist.push(user);

  text = AFK_TEXT[getSpamPreventionIter()]; 
  sendEmbedToChannel(
    ConfigManager.config["discord-bridge-channel"],
    new MessageEmbed()
      .setAuthor(`${username} ${text}`, "https://www.mc-heads.net/avatar/" + username)
      .setTimestamp()
  );
  return sendToMinecraft(`${username}${text}`);
}
