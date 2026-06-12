import { getAccessToken } from "./auth";

export async function appendRowToSheet(sheetId: string, values: any[]) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [values],
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to append to sheet");
  }

  return response.json();
}

export async function createSpreadsheet(title: string) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: title,
        },
        sheets: [
          {
            properties: {
              title: "Sheet1",
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to create spreadsheet");
  }

  const data = await response.json();

  // Add Headers
  await appendRowToSheet(data.spreadsheetId, [
    "Waktu Daftar",
    "Nama Lengkap",
    "Usia",
    "Kategori Pendaftar",
    "Alamat",
    "No WhatsApp",
    "No WA Ortu/Wali",
    "Lomba Pilihan",
  ]);

  return data;
}

export async function getOrCreateSpreadsheetId() {
  let sheetId = localStorage.getItem("padasuka_spreadsheet_id");
  if (!sheetId) {
    const sheet = await createSpreadsheet(
      "Data Pendaftar Festival Padasuka 2026",
    );
    sheetId = sheet.spreadsheetId;
    localStorage.setItem("padasuka_spreadsheet_id", sheetId!);
  }
  return sheetId;
}
