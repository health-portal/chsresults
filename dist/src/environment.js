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
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const envalid_1 = require("envalid");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    AUTO_SEED: (0, envalid_1.bool)(),
    BCRYPT_SALT: (0, envalid_1.str)(),
    DATABASE_URL: (0, envalid_1.str)(),
    DEFAULT_ADMINS: (0, envalid_1.json)(),
    JWT_SECRET: (0, envalid_1.str)(),
    PORT: (0, envalid_1.num)(),
    FRONTEND_BASE_URL: (0, envalid_1.str)(),
    SMTPEXPRESS_PROJECT_ID: (0, envalid_1.str)(),
    SMTPEXPRESS_PROJECT_SECRET: (0, envalid_1.str)(),
    SMTPEXPRESS_SENDER_EMAIL: (0, envalid_1.str)(),
});
//# sourceMappingURL=environment.js.map