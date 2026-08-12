import { getAccessToken } from "./auth";
import { getFeeDetails } from "./lib/registrationsStore";

export const DEFAULT_SPREADSHEET_ID = "1XmIC9_glnSfin0xj4uunmKhUM6CAIObHsIoPTxvYQuk";

export const SHEET_HEADERS = [
  "Nama / Tim",
  "Anggota Pemain",
  "Usia",
  "Kategori",
  "Lomba / Cabang Game",
  "Alamat / Asal",
  "Nomor WhatsApp",
  "Status Verifikasi",
  "Waktu Pendaftaran",
  "Total Bayar",
  "Total Biaya",
  "Sisa Biaya"
];

export async function appendRowToSheet(sheetId: string = DEFAULT_SPREADSHEET_ID, values: any[]) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated with Google Workspace");

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

export async function syncAllRegistrationsToSheet(
  sheetIdOrUrl: string = DEFAULT_SPREADSHEET_ID,
  registrations: any[]
) {
  const webhookUrl = localStorage.getItem("padasuka_sheet_webhook_url") || "";

  const rows = registrations.map((r, idx) => {
    const fee = getFeeDetails(r);
    return [
      idx + 1,
      r.nama || "-",
      Array.isArray(r.players) ? r.players.filter(Boolean).join(", ") : (r.anggotaTim || "-"),
      r.usia || "-",
      r.kategori || "-",
      r.lomba || "-",
      r.alamat || "-",
      r.wa || "-",
      (r.status || "pending").toUpperCase(),
      r.createdAt ? new Date(r.createdAt).toLocaleString("id-ID") : "-",
      fee.formattedBayar,
      fee.formattedBiaya,
      fee.formattedSisa
    ];
  });

  const payload = {
    action: "sync_all",
    headers: ["No", ...SHEET_HEADERS],
    rows: rows,
    registrations: registrations
  };

  // If Webhook Apps Script URL is set, use Webhook (bypasses Google OAuth Advanced Protection!)
  if (webhookUrl && webhookUrl.startsWith("https://script.google.com/")) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Gagal mengirim data ke Webhook Apps Script (${res.status})`);
    }

    return { status: "success", mode: "webhook" };
  }

  // Fallback to Google Sheets Direct API via OAuth
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Akses token Google Sheets belum aktif. Silakan login akun Google terlebih dahulu.");
  }

  const allValues = [["No", ...SHEET_HEADERS], ...rows];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetIdOrUrl}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || `Gagal menyinkronkan data ke Google Spreadsheet (${response.status})`);
  }

  return await response.json();
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
  await appendRowToSheet(data.spreadsheetId, SHEET_HEADERS);

  return data;
}

export async function getOrCreateSpreadsheetId() {
  let sheetId = localStorage.getItem("padasuka_spreadsheet_id");
  if (!sheetId) {
    sheetId = DEFAULT_SPREADSHEET_ID;
    localStorage.setItem("padasuka_spreadsheet_id", sheetId);
  }
  return sheetId;
}


