import { sendToMinecraft } from "../MinecraftManager";
import { afklist, afker, getAfkText, getNotAfkText } from "../MinecraftManager"

export function execute(username: string, args: Array<string>): void {
  for (let user of afklist) {
    if (user.username == username) {
      afklist.splice(afklist.indexOf(user), 1);
      return sendToMinecraft(`${username}${getNotAfkText()}`)
    }
  }

  let user: afker = {
    username: username,
    time: Date.now()
  }
  afklist.push(user);
  return sendToMinecraft(`${username}${getAfkText()}`);
}