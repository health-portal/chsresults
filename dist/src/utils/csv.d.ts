export declare class RowValidationError {
    row: number;
    errorMessage: string;
}
export declare class ParseCsvData<T extends object> {
    numberOfRows: number;
    validRows: T[];
    invalidRows: RowValidationError[];
}
export declare function parseCsvFile<T extends object>(file: Express.Multer.File, validationClass: new () => T): Promise<ParseCsvData<T>>;
