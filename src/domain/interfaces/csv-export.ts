export type FlattenedRow = Record<string, string | number | null>;

export interface CsvHeader {
  id: string;
  title: string;
}

export interface CsvRecord {
  [key: string]: string | number | null;
}
