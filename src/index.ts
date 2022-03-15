import {ConfigManager as ConfMan} from "./ConfigManager";
import "./bot";

export const CONFIG_PATH = "config.json";

const ConfigManager = new ConfMan(CONFIG_PATH);

