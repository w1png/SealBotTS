import { Client } from "discord.js";
import { ConfigManager as ConfMan } from "./ConfigManager";
import * as commandModules from "./discordCommands";
import { sendToMinecraft } from "./MinecraftManager";

const commands = Object(commandModules);

export const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const ConfigManager = new ConfMan("config.json");

client.once("ready", () => {
    console.log("Discord bot started!");
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) {
       return 
    }
    const { commandName } = interaction;
    commands[commandName].execute(interaction, client); 
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    // send messages from guild bridge channel to minecraft.
    if (message.channelId == ConfigManager.config["discord-bridge-channel"]) {
        // if msg > 100 chars => send in bulks of 100 - username length - 3 (the 3 is the " > ")
        sendToMinecraft(`${message.author.username} > ${message.content.slice(0, 100 - message.author.username.length - 3)}`);
        if (message.content.length > (100 - message.author.username.length)) {
            for (let i = 1; i <= Math.ceil(message.content.length / 100); i++) {
                sendToMinecraft(`${message.content.slice(100 - message.author.username.length - 3 + 100 * i)}`);
            }
        }
    }
});

client.login(ConfigManager.config["discord-token"]);

