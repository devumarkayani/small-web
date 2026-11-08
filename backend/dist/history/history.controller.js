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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const visit_schema_1 = require("./visit.schema");
class CreateVisitDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "personId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "personName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['typed', 'link', 'history', 'restore']),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "method", void 0);
let HistoryController = class HistoryController {
    constructor(visits) {
        this.visits = visits;
    }
    async list(id) { return this.visits.find({ personId: id }).sort({ visitedAt: -1 }).limit(250).lean(); }
    async create(dto) { return this.visits.create({ ...dto, address: dto.address.toLowerCase(), visitedAt: new Date() }); }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, common_1.Get)(':personId'),
    __param(0, (0, common_1.Param)('personId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVisitDto]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "create", null);
exports.HistoryController = HistoryController = __decorate([
    (0, common_1.Controller)('history'),
    __param(0, (0, mongoose_1.InjectModel)(visit_schema_1.Visit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HistoryController);
//# sourceMappingURL=history.controller.js.map