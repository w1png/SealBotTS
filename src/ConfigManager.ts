import * as fs from "fs";

const default_config_tempalte: string = `{
    "minecraft-email": "MC_EMAIL",
    "minecraft-username": "MC_USERNAME",
    "minecraft-server": "mc.hypixel.net",
    "hypixel-token": "HYPIXEL_TOKEN",
    "hypixel-guild": "HYPIXEL_GUILD_ID"
    
    "discord-token": "BOT_TOKEN",
    "discord-client-id": "DISCORD_CLIENT_ID",
    "discord-guild": "DISCORD_GUILD",
    "discord-bridge-channel": "DISCORD_BRIDGE_CHANNEL",
    "discord-officer-channel": "DISCORD_OFFICER_CHANNEL",
    "discord-console-channel": "DISCORD_CONSOLE_CHANNEL",

    "events-on": "1",
    "notif-time": "5",
    "discord-events-channel": "CHANNEL_ID",
    "jacobs-on": "1"
}`;

const default_roles_template: string = `{
    "jacobs-ping": "",
    "bot-access": "",
    "dev-team": "",
    "member": "",
    "guest": "",
    "staff": "",
    "warden": "",
    "elite": ""
}`

export default class ConfigManager {
  constructor(config_path?: string) {

    // Create a config file if does not exist
    if (!fs.existsSync("config.json")) {
      fs.writeFileSync("config.json", default_config_tempalte);
    }
    // Create roles if not exist
    if (!fs.existsSync("roles.json")) {
      fs.writeFileSync("roles.json", default_roles_template);
    }
  }

  getRawConfig(): string {
    return fs.readFileSync("config.json", "utf-8");
  }

  getRawRoles(): string {
    return fs.readFileSync("roles.json", "utf-8");
  }

  get config() {
    return JSON.parse(this.getRawConfig());
  }

  get roles() {
    return JSON.parse(this.getRawRoles());
  }

  writeConfig(param: string, value: string): void {
    let config: any = this.config;

    config[param] = value;
    fs.writeFileSync("config.json", JSON.stringify(config, null, 4));
  }
}

