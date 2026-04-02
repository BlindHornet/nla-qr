export interface CSVContactRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  email2?: string;
  email3?: string;
}

export function validateCSVRow(row: Partial<CSVContactRow>): row is CSVContactRow {
  return Boolean(row.firstName && row.lastName && row.email);
}

export function parseCSVText(csvText: string): CSVContactRow[] {
  const [headerLine, ...lines] = csvText.split(/\r?\n/).filter(Boolean);
  if (!headerLine) return [];

  const headers = headerLine.split(',').map((header) => header.trim());

  return lines
    .map((line) => {
      const values = line.split(',').map((value) => value.trim());
      const row: Partial<CSVContactRow> = {};
      headers.forEach((header, index) => {
        row[header as keyof CSVContactRow] = values[index] as never;
      });
      return row;
    })
    .filter(validateCSVRow);
}
