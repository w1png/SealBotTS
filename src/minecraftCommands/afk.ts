import { sendToMinecraft } from "../MinecraftManager";
import { afklist, afker, getAfkText, getNotAfkText } from "../MinecraftManager"
import { removeFromAfkList, getAfkUsernames } from "../utils";

export function execute(username: string, args: Array<string>): void {
  if (getAfkUsernames().includes(username)) {
    removeFromAfkList(username);
    return sendToMinecraft(`${username}${getNotAfkText()}`);
  }
  

  let user: afker = {
    username: username,
    time: Date.now()
  }
  afklist.push(user);
  return sendToMinecraft(`${username}${getAfkText()}`);
}