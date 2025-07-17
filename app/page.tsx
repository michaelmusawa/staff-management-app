// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen py-10">
      <div className="p-6 space-y-6 rounded-lg shadow-lg w-full max-w-md">
        <Link href="/dashboard/staffs">staffs</Link>

        <h1 className="text-2xl font-semibold text-center">Add a New User</h1>
      </div>

      {/* Users table */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">
          Existing Users
        </h2>
      </div>
    </main>
  );
}

// app/components/pdf/TauriPdfDownload.tsx
// "use client";

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   pdf,
// } from "@react-pdf/renderer";
// import { save } from "@tauri-apps/plugin-dialog";
// import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
// import { Button } from "@/components/ui/button";

// const styles = StyleSheet.create({
//   page: { padding: 30 },
//   section: { margin: 10, padding: 10, fontSize: 14 },
// });

// // 1) Your PDF content
// function MyReport() {
//   return (
//     <Document>
//       <Page style={styles.page}>
//         <View style={styles.section}>
//           <Text>🚔 Police Station Nominal Roll</Text>
//         </View>
//         {/* ... more sections */}
//       </Page>
//     </Document>
//   );
// }

// export default function TauriPdfDownload() {
//   const handleDownload = async () => {
//     try {
//       // 2) Render PDF to a Blob
//       const blob = await pdf(<MyReport />).toBlob();

//       // 3) Convert to Uint8Array
//       const buffer = await blob.arrayBuffer();
//       const bytes = new Uint8Array(buffer);

//       // 4) Prompt user for save location
//       const path = await save({
//         defaultPath: "nominal-roll.pdf",
//         filters: [{ name: "PDF Document", extensions: ["pdf"] }],
//       });

//       if (!path) {
//         // user cancelled
//         return;
//       }

//       // 5) Write file under AppLocalData (or pick another BaseDirectory)
//       await writeFile(path, bytes);

//       // 6) Feedback
//       console.log("PDF saved to", path);
//     } catch (e) {
//       console.error("Failed to generate or save PDF:", e);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Button onClick={handleDownload}>📄 Export Nominal Roll as PDF</Button>
//     </div>
//   );
// }
