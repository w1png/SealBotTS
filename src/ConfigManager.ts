import * as fs from "fs";

const default_config_tempalte: string = `{
"minecraft-username": "MC_EMAIL",
    "minecraft-password": "MC_PASS",
    "minecraft-server": "mc.hypixel.net",
    "hypixel-token": "HYPIXEL_TOKEN",
    
    "discord-token": "BOT_TOKEN",
    "discord-client-id": "DISCORD_CLIENT_ID",
    "discord-guild": "DISCORD_GUILD",
    "discord-bridge-channel": "DISCORD_BRIDGE_CHANNEL",
    "discord-officer-channel": "DISCORD_OFFICER_CHANNEL",
    "discord-console-channel": "DISCORD_CONSOLE_CHANNEL",
    "discord-refix": "=",
}`;

export class ConfigManager {
  config_path: string;

  constructor(config_path: string) {
    this.config_path = config_path;

    // Create a config file if does not exist
    if (!fs.existsSync(this.config_path)) {
      fs.writeFileSync(config_path, default_config_tempalte);
    }
  }

  get config() {
    return JSON.parse(fs.readFileSync(this.config_path, "utf-8"));
  }

  writeConfig(param: string, value: string): void {
    let config: any = this.config;

    config[param] = value;
    fs.writeFileSync(this.config_path, JSON.stringify(config, null, 4));
  }
}
