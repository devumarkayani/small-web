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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const site_schema_1 = require("../sites/site.schema");
let SearchController = class SearchController {
    constructor(sites) {
        this.sites = sites;
    }
    async search(q = '') {
        const term = q.trim();
        if (term.length < 2)
            return [];
        let results = [];
        try {
            results = await this.sites.find({ $text: { $search: term } }, { address: 1, title: 1, author: 1, textContent: 1, score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(30).lean();
        }
        catch { }
        if (!results.length)
            results = await this.sites.find({ $or: [{ title: { $regex: term, $options: 'i' } }, { textContent: { $regex: term, $options: 'i' } }, { address: { $regex: term, $options: 'i' } }] }, { html: 0 }).limit(30).lean();
        return results;
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __param(0, (0, mongoose_1.InjectModel)(site_schema_1.Site.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SearchController);
//# sourceMappingURL=search.controller.js.map