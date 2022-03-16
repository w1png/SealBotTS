import { Client } from "discord.js";
import { ConfigManager as ConfMan } from "./ConfigManager";
import * as commandModules from "./discordCommands";

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

});

client.login(ConfigManager.config["discord-token"]);

