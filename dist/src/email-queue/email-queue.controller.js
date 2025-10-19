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
exports.EmailQueueController = void 0;
const common_1 = require("@nestjs/common");
const email_queue_service_1 = require("./email-queue.service");
let EmailQueueController = class EmailQueueController {
    emailQueueService;
    constructor(emailQueueService) {
        this.emailQueueService = emailQueueService;
    }
    async enqueueEmails() {
        const emails = {
            title: 'Portal Update',
            message: 'Important updates have been made to the portal. Please check your account for details.',
            portalLink: 'https://results.oauchs.edu.ng/portal',
            recipients: [
                { name: 'John Doe', email: 'john.doe@example.com' },
                { name: 'Jane Smith', email: 'jane.smith@example.com' },
                { name: 'John Doe', email: 'john.doe@example.com' },
                {
                    name: 'Olugbenga Moyinoluwa',
                    email: 'olugbengamoyinoluwa839@gmail.com',
                },
                { name: 'John Doe', email: 'john.doe@example.com' },
                { name: 'Jane Smith', email: 'jane.smith@example.com' },
                { name: 'John Doe', email: 'john.doe@example.com' },
                {
                    name: 'Olugbenga Moyinoluwa',
                    email: 'olugbengamoyinoluwa839@gmail.com',
                },
            ],
        };
        return this.emailQueueService.enqueueEmails(emails);
    }
};
exports.EmailQueueController = EmailQueueController;
__decorate([
    (0, common_1.Post)('create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailQueueController.prototype, "enqueueEmails", null);
exports.EmailQueueController = EmailQueueController = __decorate([
    (0, common_1.Controller)('email-queue'),
    __metadata("design:paramtypes", [email_queue_service_1.EmailQueueService])
], EmailQueueController);
//# sourceMappingURL=email-queue.controller.js.map