import fs = require("fs");

const default_config_tempalte = `{
    "minecraft-username": "MC_EMAIL",
    "minecraft-password": "MC_PASS",
    "minecraft-server": "mc.hypixel.net",
    "hypixel-token": "HYPIXEL_TOKEN",
    
    "discord-token": "BOT_TOKEN",
    "discord-guild": "DISCORD_GUILD",
    "discord-bridge-channel": "DISCORD_BRIDGE_CHANNEL",
    "discord-officer-channel": "DISCORD_OFFICER_CHANNEL",
    "discord-console-channel": "DISCORD_CONSOLE_CHANNEL",
    "discord-refix": "=",
}`;

export class Config {
    config_path: string;
    constructor(config_path: string) {
        this.config_path = config_path;
    }

    _readConfig(): Config {
        return JSON.parse(fs.readFileSync(this.config_path, "utf-8"));
    }
    
    writeConfig(param: string, value: string): void {
        let config: Config = this._readConfig();
        config[param] = value;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    }
}


