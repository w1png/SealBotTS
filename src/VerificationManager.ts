import * as Postgres from 'ts-postgres';

export class VerificationManager { 
  client: Postgres.Client;
  constructor() {
    this.client = new Postgres.Client(); 
  }  
} 

