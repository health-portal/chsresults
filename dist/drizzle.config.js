"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const environment_1 = require("./src/environment");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle/output',
    schema: './drizzle/schema.ts',
    dialect: 'postgresql',
    dbCredentials: { url: environment_1.env.DATABASE_URL },
});
//# sourceMappingURL=drizzle.config.js.map