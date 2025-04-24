import * as papa from 'papaparse';
import { NonCSVFileError } from 'src/errors';
import { Readable } from 'stream';

interface CsvRow {
  data: string[];
}

const isCSVFile = (fileName: string): boolean => fileName.toLowerCase().endsWith('.csv');

// ---- Decode -----
export const decodeCsv = async (csvFile: Express.Multer.File, skipFirstNRows: number = 0): Promise<string[]> => {
  const stream = Readable.from(csvFile.buffer.toString());

  if (!isCSVFile(csvFile.originalname)) {
    throw new NonCSVFileError();
  }

  const parseOptions: papa.ParseConfig = {
    header: false,
    worker: false,
    delimiter: ',',
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  };

  const csvData: string[] = await new Promise((resolve, reject) => {
    const rowData: string[] = [];

    papa.parse<CsvRow>(stream, {
      ...parseOptions,
      step: (row: papa.ParseResult<CsvRow>) => {
        rowData.push(row.data[0]);
      },
      complete: () => {
        resolve(rowData);
      },
      error: (err: papa.ParseError) => {
        reject(err);
      },
    });
  });

  return skipFirstNRows ? csvData.slice(skipFirstNRows) : csvData;
};
