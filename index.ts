import fs = require("fs");
import discord = require("discordx");
import fetch = require("cross-fetch");
import * as ConfigManager from "./ConfigManager";
const CONFIG_PATH: string = "config.json";
const LOGS_PATH: string = "logs";

// First time setup

// Create a config.json file and quit
if (!fs.existsSync(CONFIG_PATH)) {
    ConfigManager.createConfig(CONFIG_PATH);
    process.exit(0);
}
const config = ConfigManager.Config(CONFIG_PATH);

// Create a logs folder and create a logger
if (!fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH)  ;  
}
// Logger here
