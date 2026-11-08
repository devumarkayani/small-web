import { Controller, Get, Query } from '@nestjs/common'; import { InjectModel } from '@nestjs/mongoose'; import { Model } from 'mongoose'; 
import { Site, SiteDocument } from '../sites/site.schema';
@Controller('search') export class SearchController {
 constructor(@InjectModel(Site.name) private sites: Model<SiteDocument>) {}
 @Get() async search(@Query('q') q = '') {
  const term = q.trim(); if (term.length < 2) return [];
  let results: any[] = [];
  try { results = await this.sites.find({ $text: { $search: term } }, { address: 1, title: 1, author: 1, textContent: 1, score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(30).lean(); } catch {}
  if (!results.length) results = await this.sites.find({ $or: [{ title: { $regex: term, $options: 'i' } }, { textContent: { $regex: term, $options: 'i' } }, { address: { $regex: term, $options: 'i' } }] }, { html: 0 }).limit(30).lean();
  return results;
 }
}
