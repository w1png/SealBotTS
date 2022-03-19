import { Client } from "discord.js";
import { ConfigManager as ConfMan } from "./ConfigManager";
import * as commandModules from "./discordCommands";
import { sendToMinecraft } from "./MinecraftManager";

const commands = Object(commandModules);

const ConfigManager = new ConfMan("config.json");
export const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.once("ready", () => {
  console.log("Discord bot started!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.on("messageCreate", (message) => {
  // dont parse own messages
  if (message.author.bot) return;

  // send messages from guild/officer bridge channel to minecraft.
  if ([ConfigManager.config["discord-bridge-channel"], ConfigManager.config["discord-officer-channel"]].includes(message.channelId)) {
    var targetMinecraftChatPrefix = (message.channelId == ConfigManager.config["discord-bridge-channel"]) ? "/gc": "/oc"; 

    // send the 1st part of the message
    sendToMinecraft(`${targetMinecraftChatPrefix} ${message.author.username} > ${message.content.slice(0, 100 - message.author.username.length - 3)}`);

    // if msg > 100 chars => send in bulks of 100 - username length - 3 (the 3 is the " > ")
    if (message.content.length > 100 - message.author.username.length - 3)
      for (let i = 1; i <= Math.ceil(message.content.length / 100); i++)
        sendToMinecraft(`${targetMinecraftChatPrefix} ${message.content.slice(100 - message.author.username.length - 3 + 100 * i)}`);
  }
});

client.login(ConfigManager.config["discord-token"]);
