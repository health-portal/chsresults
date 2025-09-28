"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCsvData = exports.RowValidationError = void 0;
exports.parseCsvFile = parseCsvFile;
const stream_1 = require("stream");
const csv = __importStar(require("fast-csv"));
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RowValidationError {
    row;
    errorMessage;
}
exports.RowValidationError = RowValidationError;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RowValidationError.prototype, "row", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RowValidationError.prototype, "errorMessage", void 0);
class ParseCsvData {
    numberOfRows;
    validRows;
    invalidRows;
}
exports.ParseCsvData = ParseCsvData;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParseCsvData.prototype, "numberOfRows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], ParseCsvData.prototype, "validRows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RowValidationError] }),
    __metadata("design:type", Array)
], ParseCsvData.prototype, "invalidRows", void 0);
async function parseCsvFile(file, validationClass) {
    return new Promise((resolve, reject) => {
        const validRows = [];
        const invalidRows = [];
        let currentRow = 0;
        const stream = stream_1.Readable.from(file.buffer);
        stream
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
            reject(new common_1.UnprocessableEntityException(error.message));
        })
            .on('data', (row) => {
            currentRow++;
            const transformedRow = (0, class_transformer_1.plainToInstance)(validationClass, row);
            const validationErrors = (0, class_validator_1.validateSync)(transformedRow);
            if (validationErrors.length > 0) {
                validationErrors.map((error) => {
                    invalidRows.push({
                        row: currentRow,
                        errorMessage: error.toString(),
                    });
                });
            }
            else {
                validRows.push(transformedRow);
            }
        })
            .on('end', () => {
            resolve({ validRows, invalidRows, numberOfRows: currentRow });
        });
    });
}
//# sourceMappingURL=csv.js.map