import * as sqlite3 from "sqlite3";

export const db = new sqlite3.Database("data.db");
db.run("CREATE TABLE IF NOT EXISTS users (discord_id TEXT, username TEXT)");

import "./MinecraftManager";
import "./DiscordManager";

