"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const smtpexpress_1 = require("smtpexpress");
const environment_1 = require("../environment");
let EmailQueueService = class EmailQueueService {
    emailClient = (0, smtpexpress_1.createClient)({
        projectId: environment_1.env.SMTPEXPRESS_PROJECT_ID,
        projectSecret: environment_1.env.SMTPEXPRESS_PROJECT_SECRET,
    });
    async send({ subject, toEmail, htmlContent }) {
        await this.emailClient.sendApi.sendMail({
            subject,
            message: htmlContent,
            sender: {
                name: 'Obafemi Awolowo University - College of Health Sciences',
                email: environment_1.env.SMTPEXPRESS_SENDER_EMAIL,
            },
            recipients: toEmail,
        });
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = __decorate([
    (0, common_1.Injectable)()
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map