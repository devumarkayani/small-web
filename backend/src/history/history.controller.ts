import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './visit.schema';
class CreateVisitDto { @IsString() personId: string; @IsString() personName: string; @IsString() address: string; @IsString() title: string; @IsIn(['typed','link','history','restore']) method: string; }
@Controller('history') export class HistoryController {
 constructor(@InjectModel(Visit.name) private visits: Model<VisitDocument>) {}
 @Get(':personId') async list(@Param('personId') id: string) { return this.visits.find({ personId: id }).sort({ visitedAt: -1 }).limit(250).lean(); }
 @Post() async create(@Body() dto: CreateVisitDto) { return this.visits.create({ ...dto, address: dto.address.toLowerCase(), visitedAt: new Date() }); }
}
