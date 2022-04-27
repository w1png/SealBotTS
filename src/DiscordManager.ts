import { Client, Intents } from "discord.js";
import ConfMan from "./ConfigManager";
import * as commandModules from "./discordCommands";
import { sendToMinecraft } from "./MinecraftManager";
import { handleEvents } from "./EventHandler";
import { ConsoleLogger as ConsLog } from "./ConsoleLogger";
import { runAfkPreventionCommands } from "./utils";

const commands = Object(commandModules);

const ConfigManager = new ConfMan("config.json");
const ConsoleLogger = new ConsLog();

export const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.once("ready", () => {
  console.log("Discord bot started!");
  ConsoleLogger.log("**Discord bot started**");
});


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  ConsoleLogger.log(`**Discord**: [<#${interaction.channelId}>] <${interaction.user.username}> ${interaction.toString()}`);
  commands[commandName].execute(interaction, client);
});


client.on("messageCreate", async (message) => {
  // dont parse own messages
  if (message.author.bot) return;

  // send messages from guild/officer bridge channel to minecraft.
  if ([ConfigManager.config["discord-bridge-channel"], ConfigManager.config["discord-officer-channel"]].includes(message.channelId)) {
    var targetMinecraftChatPrefix = (message.channelId == ConfigManager.config["discord-bridge-channel"]) ? "/gc": "/oc"; 

    var username = message.member ? message.member.nickname: message.author.username ? message.author.username: "unknown_name";
    var message_text = message.content;
    if (message.mentions) {
      message.mentions.members!.forEach(member => {
        message_text = message_text.replace(`<@${member.id}>`, member.nickname ? `@(${member.nickname})`: "unknown_name");
      });
    }

    var minecraftMessage: string = `${targetMinecraftChatPrefix} ${username} > ${message_text.slice(0, 100 - username!.length - 3)}`;

    // send the 1st part of the message
    sendToMinecraft(minecraftMessage);
    ConsoleLogger.log(`**Discord** [<#${ConfigManager.config["discord-bridge-channel"]}>]: ${minecraftMessage}`); 

    // TODO: fix that 
    // if msg > 100 chars => send in bulks of 100 - username length - 3 (the 3 is the " > ")
    // if (message.content.length > 100 - message.author.username.length - 3)
    //   for (let i = 1; i <= Math.ceil(message.content.length / 100); i++) {
    //     sendToMinecraft(`${targetMinecraftChatPrefix} ${message.content.slice(100 - message.author.username.length - 3 + 100 * i)}`); 
    //     await timeout(500);
    //     console.log(`${targetMinecraftChatPrefix} ${message.content.slice(100 - message.author.username.length - 3 + 100 * i)}`);
    //   }
  }
});


// check for events every minute
setInterval(() => {
  if (ConfigManager.config["events-on"] == 1)
    handleEvents();
}, 60000)

// execute spam prevention stuff
setInterval(() => {
  runAfkPreventionCommands();
}, 900000)

client.login(ConfigManager.config["discord-token"]);
