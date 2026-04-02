export interface CSVContactRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  email2?: string;
  email3?: string;
}

export interface SkippedRow {
  rowNumber: number; // 1-based, not counting the header
  raw: string;
  reason: string;
}

export interface ParseResult {
  valid: CSVContactRow[];
  skipped: SkippedRow[];
}

function getSkipReason(row: Partial<CSVContactRow>): string | null {
  if (!row.firstName) return "Missing first name";
  if (!row.lastName) return "Missing last name";
  if (!row.email) return "Missing email";
  return null;
}

export function parseCSVText(csvText: string): ParseResult {
  const [headerLine, ...lines] = csvText.split(/\r?\n/).filter(Boolean);
  if (!headerLine) return { valid: [], skipped: [] };

  const headers = headerLine.split(',').map((h) => h.trim());
  const valid: CSVContactRow[] = [];
  const skipped: SkippedRow[] = [];

  lines.forEach((line, index) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Partial<CSVContactRow> = {};
    headers.forEach((header, i) => {
      row[header as keyof CSVContactRow] = values[i] as never;
    });

    const reason = getSkipReason(row);
    if (reason) {
      skipped.push({ rowNumber: index + 1, raw: line, reason });
    } else {
      valid.push(row as CSVContactRow);
    }
  });

  return { valid, skipped };
}
