import * as minecraftProtocol from "minecraft-protocol"
import * as commandModules from "./minecraftCommands";
import { ConfigManager as ConfMan } from "./ConfigManager";

const commands = Object(commandModules);
const ConfigManager = new ConfMan("config.json");

var client = minecraftProtocol.createClient({
    host: ConfigManager.config["minecraft-server"],
    username: ConfigManager.config["minecraft-email"],
    password: ConfigManager.config["minecraft-password"],
    auth: "microsoft",
    version: "1.8.9"
});

function removeColors(text: string) {
    return text.replace(/\u00A7[0-9A-FK-OR]/ig, "");
}

function removeRanks(text: string) {
   return text.replace(/ *\[[^\]]*]/g, '')};

client.on('chat', function(packet: any) {
    // Listen for chat messages and echo them back.

    var msg = JSON.parse(packet.message);
    var username: string;
    var text: string;
    try {
        if (msg.text == "Guild > ") {
            console.log(`${msg.extra[0].text} ${msg.extra[1].text}`); 
        } else if (msg.text == "") {
            username = removeColors(msg.extra[0].text).replace(/ /g,'');
            text = removeColors(msg.extra[1].text); 
            if (username.startsWith("Guild>")) {
                username = removeRanks(username.slice(6).slice(0, -1)); 
                console.log(`${username}: ${text}`);
            }  
        }
    } catch{}
});

