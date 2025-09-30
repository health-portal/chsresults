"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_pgmq_1 = require("prisma-pgmq");
const smtpexpress_1 = require("smtpexpress");
const environment_1 = require("../environment");
let EmailQueueService = class EmailQueueService {
    queueName = 'email';
    prisma;
    emailClient = (0, smtpexpress_1.createClient)({
        projectId: environment_1.env.SMTPEXPRESS_PROJECT_ID,
        projectSecret: environment_1.env.SMTPEXPRESS_PROJECT_SECRET,
    });
    async onModuleInit() {
        this.prisma = new client_1.PrismaClient();
        await this.prisma.$connect();
        await prisma_pgmq_1.pgmq.createQueue(this.prisma, this.queueName);
    }
    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }
    async createTask(data) {
        await prisma_pgmq_1.pgmq.send(this.prisma, this.queueName, { data });
        console.log('Created task:', data);
    }
    async processTask() {
        const [message] = await prisma_pgmq_1.pgmq.pop(this.prisma, this.queueName);
        if (message) {
            const { subject, toEmail, htmlContent } = message.message;
            await this.emailClient.sendApi.sendMail({
                subject,
                message: htmlContent,
                sender: {
                    name: 'Obafemi Awolowo University - College of Health Sciences',
                    email: environment_1.env.SMTPEXPRESS_SENDER_EMAIL,
                },
                recipients: toEmail,
            });
            console.log(`Popped task:`, message.message);
        }
    }
};
exports.EmailQueueService = EmailQueueService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailQueueService.prototype, "processTask", null);
exports.EmailQueueService = EmailQueueService = __decorate([
    (0, common_1.Injectable)()
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map