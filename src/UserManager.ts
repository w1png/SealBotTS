import { db } from "./index";
import { ConsoleLogger as ConsLog } from "./ConsoleLogger"; 

const ConsoleLogger = new ConsLog();

export interface User {
  username: string,
  discord_id: string
}

export class UserManager {
  getUserByDiscordId(discord_id: string): Promise<User> { 
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE discord_id="${discord_id}"`,(err, row) => {
        try {
          let user: User = {
            username: row.username,
            discord_id: row.discord_id
          } 
          resolve(user);
        } catch {
          ConsoleLogger.logWarn(`User <@&${discord_id}> was not found in the database.`);
          reject(undefined);
        } 
      });
    });
  }
  
  getUserByMinecraftUsername(minecraft_username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username="${minecraft_username}"`,(err, row) => {
        try {
          let user: User = {
            username: row.username,
            discord_id: row.discord_id
          } 
          resolve(user);
        } catch {
          ConsoleLogger.logWarn(`User ${minecraft_username} was not found in the database.`);
          reject(undefined);
        }
      });
    });
  }

  createUser(user: User): void {
    ConsoleLogger.log(`<@&${user.discord_id}> was added to the database!`);
    db.run("INSERT INTO users VALUES (?, ?)", [user.discord_id, user.username]); 
  }

  removeUser(discord_id: string): void {
    ConsoleLogger.log(`<@&${discord_id}> was removed from the database!`);
    db.run("DELETE FROM users WHERE discord_id=?", [discord_id]);
  }

  getUsers(): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`,(err, row) => {
        try {
          let userList: Array<User> = [];
          let user: User;

          for (let userRaw of row) {
            user = {
              username: userRaw.username,
              discord_id: userRaw.discord_id
            } 
            userList.push(user);
          }

          resolve(userList);
        } catch {
          ConsoleLogger.logWarn("Failed to get users.");
          reject([]);
        }
      });
    });
  }
}
