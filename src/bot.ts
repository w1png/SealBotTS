import { Client } from "discord.js";
import {ConfigManager as ConfMan} from "./ConfigManager";
import * as commandModules from "./commands";

const commands = Object(commandModules);

export const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const ConfigManager = new ConfMan("config.json");

client.once("ready", () => {
    console.log("Bot started!");
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) {
       return 
    }
    const { commandName } = interaction;
   commands[commandName].execute(interaction, client); 
});

client.on("message", (message) => {
    if (message.author.bot) return;

});

client.login(ConfigManager.config["discord-token"]);

