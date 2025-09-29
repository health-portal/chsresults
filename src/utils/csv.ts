import { Readable } from 'stream';
import * as csv from 'fast-csv';
import { plainToInstance } from 'class-transformer';
import { UnprocessableEntityException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RowValidationError {
  @ApiProperty()
  row: number;

  @ApiProperty()
  errorMessage: string;
}

export class ParseCsvData<T extends object> {
  @ApiProperty()
  numberOfRows: number;

  @ApiProperty({ type: [Object] })
  validRows: T[];

  @ApiProperty({ type: [RowValidationError] })
  invalidRows: RowValidationError[];
}

export async function parseCsvFile<T extends object>(
  file: Express.Multer.File,
  validationClass: new () => T,
): Promise<ParseCsvData<T>> {
  return new Promise((resolve, reject) => {
    const validRows: T[] = [];
    const invalidRows: RowValidationError[] = [];

    let currentRow = 0;

    const stream = Readable.from(file.buffer);
    stream
      .pipe(csv.parse({ headers: true, strictColumnHandling: true }))
      .on('error', (error) => {
        reject(new UnprocessableEntityException(error.message));
      })
      .on('data', (row) => {
        currentRow++;
        const transformedRow = plainToInstance(validationClass, row);
        const validationErrors = validateSync(transformedRow);

        if (validationErrors.length > 0) {
          validationErrors.map((error) => {
            invalidRows.push({
              row: currentRow,
              errorMessage: error.toString(),
            });
          });
        } else {
          validRows.push(transformedRow);
        }
      })
      .on('end', () => {
        resolve({ validRows, invalidRows, numberOfRows: currentRow });
      });
  });
}
