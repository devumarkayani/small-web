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
exports.SitesService = void 0;
exports.htmlToText = htmlToText;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const site_schema_1 = require("./site.schema");
function htmlToText(html) {
    return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
let SitesService = class SitesService {
    constructor(model) {
        this.model = model;
    }
    async findByAddress(address) {
        const normalized = address.toLowerCase().trim();
        const site = await this.model.findOne({ address: normalized }).lean();
        if (!site)
            throw new common_1.NotFoundException(`No site exists at ${normalized}.`);
        return site;
    }
    async create(dto) {
        const address = dto.address.toLowerCase().trim();
        if (await this.model.exists({ address }))
            throw new common_1.ConflictException('That address is already published.');
        return this.model.create({ ...dto, address, textContent: htmlToText(dto.html) });
    }
    async all() { return this.model.find({}, { address: 1, title: 1, author: 1 }).sort({ address: 1 }).lean(); }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(site_schema_1.Site.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SitesService);
//# sourceMappingURL=sites.service.js.map