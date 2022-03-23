import { sendToMinecraft } from "../MinecraftManager"

export function execute(username: string, args: Array<string>): void {
  sendToMinecraft(((Math.random() * (1 - 0)) == 1) ? "The coin landed tails!": "The coins landed heads!");
}


