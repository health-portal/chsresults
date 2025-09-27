"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturersModule = void 0;
const common_1 = require("@nestjs/common");
const lecturers_service_1 = require("./lecturers.service");
const lecturers_controller_1 = require("./lecturers.controller");
let LecturersModule = class LecturersModule {
};
exports.LecturersModule = LecturersModule;
exports.LecturersModule = LecturersModule = __decorate([
    (0, common_1.Module)({
        controllers: [lecturers_controller_1.LecturersController],
        providers: [lecturers_service_1.LecturersService],
    })
], LecturersModule);
//# sourceMappingURL=lecturers.module.js.map