import { sendToMinecraft, getPingTextList, getSpamPreventionIter } from "../MinecraftManager";

export async function execute(username: string, args: Array<string>) {
  let iter = getSpamPreventionIter();
  getPingTextList().then((pingTextList) => {
    sendToMinecraft(pingTextList[iter])
  });
}

