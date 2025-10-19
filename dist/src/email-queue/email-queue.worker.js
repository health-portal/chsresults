"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const email_queue_service_1 = require("./email-queue.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const queue = app.get(email_queue_service_1.EmailQueueService);
    console.log('Worker started...');
    try {
        await queue.processQueue();
        console.log('Worker finished processing all queued emails.');
    }
    catch (error) {
        console.error('Worker encountered an error:', error);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
bootstrap();
//# sourceMappingURL=email-queue.worker.js.map