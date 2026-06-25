// Tiny CSV helpers (no dependency). Used by the client Users grid + the Assign & permissions
// matrix to export the FULL current set (every matching row, not just the visible page).

/** Build a CSV string (RFC 4180-ish): a cell is quoted only when it contains a comma, quote, or
 *  newline; embedded quotes are doubled. First row is typically the header. CRLF line endings. */
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

/** Trigger a browser download of `csvText` as a .csv file. No-op on the server. */
export function downloadCsv(filename: string, csvText: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(new Blob([csvText], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Filesystem-friendly slug for a download filename. */
export function fileSlug(s: string): string {
  return (s || "export").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "export";
}
