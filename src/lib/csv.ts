export interface CSVContactRow {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  email2?: string;
  email3?: string;
}

export function validateCSVRow(row: Partial<CSVContactRow>): boolean {
  return Boolean(row.firstName && row.lastName && row.email);
}
