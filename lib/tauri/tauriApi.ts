// app/lib/tauri/tauriApi.ts

import { invoke } from "@tauri-apps/api/core";

export async function myCustomCommand() {
  try {
    const result = await invoke("my_custom_command");
    return result;
  } catch (error) {
    console.error("Error invoking my_custom_command:", error);
    throw error;
  }
}
