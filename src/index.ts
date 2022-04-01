import {ConfigManager as ConfMan} from "./ConfigManager";

export const CONFIG_PATH = "config.json";
const ConfigManager = new ConfMan(CONFIG_PATH);

import "./DiscordManager";
import "./MinecraftManager";

