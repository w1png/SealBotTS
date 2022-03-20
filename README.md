# SealBotTS

##### This a Typescript rewrite of [SealBot](https://github.com/BamBoozledMC/sealbot) by [@BamBoozledMC](https://github.com/BamBoozledMC/) that focuses on ease of modification and aims to be as modular as possible. You can try this bot in action in [Boreas](https://discord.gg/boreas).

---

- [SealBotTS](#sealbotts)
    - [Installing dependencies](#installing-dependencies)
    - [Running the bot](#running-the-bot)
    - [Contributing](#contributing)
        - [Installing dev dependencies](#installing-dev-dependencies)
        - [Running in developer mode mode](#running-in-developer-mode-mode)
        - [Making discord commands](#making-discord-commands)
        - [Making minecraft commands](#making-minecraft-commands)

---

#### Installing dependencies

```bash
$ npm install @discordjs/rest@0.3.0 discord.js@13.3.1 minecraft-protocol
```

#### Running the bot

```bash
$ yarn build
$ yarn start
```

#### Contributing

###### Installing dev dependencies

```bash
$ npm install --sav-dev concurrently@6.4.0 nodemon@2.0.15 typescript@4.4.4
```

###### Running in developer mode mode

Running the bot in developer makes the bot refresh after you make changes to files.

```bash
$ yarn dev
```

###### Making discord commands

1. Create a new file in ***discordCommands*** folder (i.e. ***ping.ts***)

2. Put a template inside the file you've just created:
   
   ```typescript
   import { SlashCommandBuilder } from "@discordjs/builders";
   import {CommandInteraction} from "discord.js";
   
   export const data = new SlashCommandBuilder()
       .setName("command_name") // i.e. .setName("ping") will make it a /ping command
       .setDescription("command_description"); // i.e. .setDescription("allows you see the bot's latency");
   
   export async function execute(interaction: CommandInteraction) {
       return interaction.reply("reply_text"); // i.e. return interaction.reply("pong!");
   }
   ```

3. Add the command into ***discordCommands/index.ts***
   
   ```bash
   echo '\nexport * as command_name from "./command_file_name"' >> discordCommands/index.ts
   ```
   
   For example:
   
   ```bash
   echo '\nexport * as help from "./ping" >> discordCommands/ping.ts'
   ```

4. Register the new command
   
   ```bash
   yarn deploy:commands
   ```

###### Making minecraft commands

1. Create a new file in ***minecraftCommands*** folder (i.e. ***ping.ts***)

2. Put a template inside the file you've just created:
   
   ```typescript
   import { sendToMinecraft } from "../MinecraftManager";
   
   export function execute(username: string, args: Array<string>): void {
     sendToMinecraft("text you want to send to minecraft"); // i.e. sendToMinecraft("pong");
   }
   ```

3. Add the command into ***minecraftCommands/index.ts***
   
   ```bash
   echo '\nexport * as command_name from "./command_file_name"'
   ```
   
   For example:
   
   ```bash
   echo '\nexport * as ping from "./ping"'
   ```
