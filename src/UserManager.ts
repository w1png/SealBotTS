import { db } from "./index";
import { getDatabaseQueryResult } from "./utils";

export class UserManager {
  getUsernameByDiscordId(discord_id: string): any { 
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE discord_id="${discord_id}"`,(err, row) => {
         resolve(row.username); 
      });
    });
  }
  
  getDiscordIdByMinecraftUsername(minecraft_username: string) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username="${minecraft_username}"`,(err, row) => {
         resolve(row.discord_id);
      });
    });
  }

  createUser(discord_id: string, username: string) {
    db.run("INSERT INTO users VALUES (?, ?)", [discord_id, username]); 
  }

  removeUser(discord_id: string) {
    db.run("DELETE FROM users WHERE discord_id=?", [discord_id]);
  }
}
