import {ConfigManager as ConfMan} from "./ConfigManager";
import "./DiscordManager";
import "./MinecraftManager";

export const CONFIG_PATH = "config.json";

export let lurklist = [["w1png", Date.now()], ["herc", 129321048]];
// export let lurklist = Array();

const ConfigManager = new ConfMan(CONFIG_PATH);



