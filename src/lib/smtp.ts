import { invoke } from "@tauri-apps/api/tauri";

export enum Action {
  Start = "start_server",
  Stop = "stop_server",
}

export function startSmtpServer(): Promise<void> {
  return invoke(Action.Start);
}

export function stopSmtpServer(): Promise<void> {
  return invoke(Action.Stop);
}
