import * as utils from "../utils";
import { afklist, sendToMinecraft } from "../MinecraftManager";
import { NO_AFK_TEXT, getSpamPreventionIter } from "../MinecraftManager";

export function execute(username: string, args: Array<string>): void {
  if (afklist.length == 0) return sendToMinecraft(NO_AFK_TEXT[getSpamPreventionIter()]);

  if (utils.getAfkUsernames().join(" ").length <= 100) sendToMinecraft(utils.getAfkUsernames().join(" "));
  
  var lurkingPlayersText = "";
  for (let user of afklist) {
    if (lurkingPlayersText.length + user.username.length > 100) {
      sendToMinecraft(lurkingPlayersText);
      lurkingPlayersText = "";
    }
  }
}
