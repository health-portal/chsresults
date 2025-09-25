import * as fs from 'fs';
import * as csv from 'csv-parser';

export class CsvValidationError extends Error {
  public row?: number;

  constructor(message: string, row?: number) {
    super(message);
    this.name = 'CsvValidationError';
    this.row = row;
  }
}

export interface CsvRow {
  [key: string]: string | undefined;
}

export interface CsvColumnMapping {
  [csvHeader: string]: string; // maps CSV header to normalized field name
}

export interface CsvProcessingOptions<T> {
  requiredFields: string[];
  fieldMappings: CsvColumnMapping;
  validateRow: (row: CsvRow, rowIndex: number) => void;
  mapToDto: (row: CsvRow) => T;
}

export async function readCsvFile(
  filePath: string,
  fieldMappings: CsvColumnMapping,
): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const results: CsvRow[] = [];
    let rowNumber = 0;

    fs.createReadStream(filePath)
      .pipe(csv.default())
      .on('data', (data) => {
        rowNumber++;
        // Normalize row using field mappings
        const normalized: CsvRow = {};
        for (const [csvHeader, fieldName] of Object.entries(fieldMappings)) {
          normalized[fieldName] =
            data[csvHeader] ||
            data[csvHeader.toLowerCase()] ||
            data[csvHeader.toUpperCase()];
        }
        results.push(normalized);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(
          new CsvValidationError(`Failed to read CSV file: ${error.message}`),
        );
      });
  });
}

export function validateRequiredFields(
  row: CsvRow,
  requiredFields: string[],
  rowIndex: number,
): void {
  for (const field of requiredFields) {
    if (!row[field]) {
      throw new CsvValidationError(
        `Missing required field '${field}' at row ${rowIndex + 1}`,
        rowIndex + 1,
      );
    }
  }
}

export async function processCsvFile<T>(
  filePath: string,
  options: CsvProcessingOptions<T>,
): Promise<T[]> {
  const rows = await readCsvFile(filePath, options.fieldMappings);

  if (rows.length === 0) {
    throw new CsvValidationError('CSV file is empty');
  }

  // Validate each row
  rows.forEach((row, index) => {
    validateRequiredFields(row, options.requiredFields, index);
    options.validateRow(row, index);
  });

  // Parse to DTOs
  return rows.map(options.mapToDto);
}
