"use client";

import { pdf, Document } from "@react-pdf/renderer";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

export function useTauriPdfSave<T>(
  createDocument: (data: T) => React.ReactElement,
  defaultFilename: string
) {
  return async (data: T) => {
    // 1) render PDF document to Blob
    const blob = await pdf(createDocument(data)).toBlob();
    const array = await blob.arrayBuffer();
    const bytes = new Uint8Array(array);

    // 2) ask the user where
    const path = await save({
      defaultPath: defaultFilename,
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (!path) return; // cancelled

    // 3) write to disk
    await writeFile(path, bytes);
  };
}
