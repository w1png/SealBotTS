import {ConfigManager as ConfMan} from "./ConfigManager";

export const CONFIG_PATH = "config.json";
const ConfigManager = new ConfMan(CONFIG_PATH);

import "./DiscordManager";
import "./MinecraftManager";

export const roles: Map<string, string> = new Map<string, string>([
  ["bot_access", "955102304753840211"],
  ["jacobs_ping", "no role set for now"],
  ["dev-team", "939840672805052467"],
  ["member", "877188839255453766"],
  ["guest", "920329177406799872"],

  // ["bot_access", "940646053001183232"], // test server
  // ["member", "958078163081125888"]
]);

