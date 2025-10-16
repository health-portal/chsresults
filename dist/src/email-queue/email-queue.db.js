"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseDb = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.MESSAGE_QUEUE_DATABASE_URL,
});
exports.supabaseDb = (0, node_postgres_1.drizzle)(pool);
//# sourceMappingURL=email-queue.db.js.map