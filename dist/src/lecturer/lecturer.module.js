"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerModule = void 0;
const common_1 = require("@nestjs/common");
const lecturer_service_1 = require("./lecturer.service");
const lecturer_controller_1 = require("./lecturer.controller");
const email_queue_module_1 = require("../email-queue/email-queue.module");
let LecturerModule = class LecturerModule {
};
exports.LecturerModule = LecturerModule;
exports.LecturerModule = LecturerModule = __decorate([
    (0, common_1.Module)({
        imports: [email_queue_module_1.EmailQueueModule],
        controllers: [lecturer_controller_1.LecturerController],
        providers: [lecturer_service_1.LecturerService],
    })
], LecturerModule);
//# sourceMappingURL=lecturer.module.js.map