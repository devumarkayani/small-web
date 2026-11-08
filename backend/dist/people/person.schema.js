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
exports.PersonSchema = exports.Person = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Person = class Person {
};
exports.Person = Person;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Person.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'reader' }),
    __metadata("design:type", String)
], Person.prototype, "kind", void 0);
exports.Person = Person = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Person);
exports.PersonSchema = mongoose_1.SchemaFactory.createForClass(Person);
//# sourceMappingURL=person.schema.js.map