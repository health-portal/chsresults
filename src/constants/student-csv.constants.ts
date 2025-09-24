import { CsvRow, CsvColumnMapping, CsvProcessingOptions } from '../utils/csv/csv.utils';

export interface StudentCsvRow extends CsvRow {
    email: string;
    matricNumber: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    departmentId: string;
}

export const studentFieldMappings: CsvColumnMapping = {
    'email': 'email',
    'matric_number': 'matricNumber',
    'first_name': 'firstName',
    'last_name': 'lastName',
    'other_name': 'otherName',
    'department_id': 'departmentId',
};

export function validateStudentRow(row: CsvRow, rowIndex: number): void {
    const studentRow = row as StudentCsvRow;
    if (!studentRow.email || !studentRow.email.includes('@')) {
        throw new Error(`Invalid email at row ${rowIndex + 1}`);
    }
    // Additional validations can be added here
}

export function mapStudentToDto(row: CsvRow): any { // Replace 'any' with CreateStudentDto when imported
    const studentRow = row as StudentCsvRow;
    return {
        email: studentRow.email,
        matricNumber: studentRow.matricNumber,
        password: '', // Will be set later or generated
        firstName: studentRow.firstName,
        lastName: studentRow.lastName,
        otherName: studentRow.otherName || undefined,
        departmentId: studentRow.departmentId,
    };
}

export const studentCsvOptions: CsvProcessingOptions<any> = {
    requiredFields: ['email', 'matricNumber', 'firstName', 'lastName', 'departmentId'],
    fieldMappings: studentFieldMappings,
    validateRow: validateStudentRow,
    mapToDto: mapStudentToDto,
};