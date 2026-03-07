import { invoke } from "@tauri-apps/api/core"

export enum Action {
  Start = "start_server",
  Stop = "stop_server",
}

export function startSmtpServer(): Promise<string> {
  return invoke<string>(Action.Start)
}

export function stopSmtpServer(): Promise<string> {
  return invoke<string>(Action.Stop)
}
