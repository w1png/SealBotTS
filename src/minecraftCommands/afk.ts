import { sendToMinecraft } from "../MinecraftManager";
import { afklist, NOT_AFK_TEXT, AFK_TEXT, getSpamPreventionIter, afker } from "../MinecraftManager"
import { removeFromAfkList, getAfkUsernames } from "../utils";

export function execute(username: string, args: Array<string>): void {
  if (getAfkUsernames().includes(username)) {
    removeFromAfkList(username);
    return sendToMinecraft(`${username}${NOT_AFK_TEXT[getSpamPreventionIter()]}`);
  }
  
  let user: afker = {
    username: username,
    time: Date.now()
  }
  afklist.push(user);
  return sendToMinecraft(`${username}${AFK_TEXT[getSpamPreventionIter()]}`);
}
