import { CsvRow, CsvColumnMapping, CsvProcessingOptions } from '../utils/csv/csv.utils';

export interface LecturerCsvRow extends CsvRow {
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    departmentId: string;
}

export const lecturerFieldMappings: CsvColumnMapping = {
    'email': 'email',
    'first_name': 'firstName',
    'last_name': 'lastName',
    'other_name': 'otherName',
    'phone': 'phone',
    'department_id': 'departmentId',
};

export function validateLecturerRow(row: CsvRow, rowIndex: number): void {
    const lecturerRow = row as LecturerCsvRow;
    if (!lecturerRow.email || !lecturerRow.email.includes('@')) {
        throw new Error(`Invalid email at row ${rowIndex + 1}`);
    }
    // Additional validations can be added here
}

export function mapLecturerToDto(row: CsvRow): any { // Replace 'any' with CreateLecturerDto when imported
    const lecturerRow = row as LecturerCsvRow;
    return {
        email: lecturerRow.email,
        // password: '', // Not included in CSV - handled separately
        firstName: lecturerRow.firstName,
        lastName: lecturerRow.lastName,
        otherName: lecturerRow.otherName || undefined,
        phone: lecturerRow.phone || undefined,
        departmentId: lecturerRow.departmentId,
    };
}

export const lecturerCsvOptions: CsvProcessingOptions<any> = {
    requiredFields: ['email', 'firstName', 'lastName', 'departmentId'],
    fieldMappings: lecturerFieldMappings,
    validateRow: validateLecturerRow,
    mapToDto: mapLecturerToDto,
};