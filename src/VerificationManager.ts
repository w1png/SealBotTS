import * as Postgres from 'ts-postgres';
import { client } from "./DiscordManager";
import { generate } from "randomstring";

function generateToken(): string{
  var token = "";
  // some arr that contains all the active tokens
  var tokenList: Array<string>;
  tokenList = [];

  while (tokenList.includes(token)) {
    token = generate(6); 
  }

  return token;
}

export class VerificationManager { 
    client: Postgres.Client;
    
    constructor() {
        this.client = new Postgres.Client(); 
    }
    
    registerUser(username: string) {
      "INSERT INTO users VALUES (?)"
      
    }

} 

