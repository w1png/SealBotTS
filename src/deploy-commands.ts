import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {ConfigManager as ConfMan} from "./ConfigManager";
import * as commandModules from "./discordCommands";
 
const ConfigManager = new ConfMan("config.json");

type Command = { data: unknown; }
const commands = Array();

for (const module of Object.values<Command>(commandModules))
  commands.push(module.data);

const rest = new REST({ version: "9" }).setToken(ConfigManager.config["discord-token"]);

rest.put(Routes.applicationGuildCommands(ConfigManager.config["discord-client-id"], ConfigManager.config["discord-guild"]), {body: commands}).then(() => {
  console.log("Application commands reigstered!");
}).catch(console.error);
