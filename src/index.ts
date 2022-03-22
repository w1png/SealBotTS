import {ConfigManager as ConfMan} from "./ConfigManager";

export const CONFIG_PATH = "config.json";
const ConfigManager = new ConfMan(CONFIG_PATH);

import "./DiscordManager";
import "./MinecraftManager";

export const roles: Map<string, string> = new Map<string, string>([
  ["bot_access", "955102304753840211"]
  // ["bot_access", "940646053001183232"]
]);

