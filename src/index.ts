import {ConfigManager as ConfMan} from "./ConfigManager";
import "./DiscordManager";
import "./MinecraftManager";

export const CONFIG_PATH = "config.json";

const ConfigManager = new ConfMan(CONFIG_PATH);



