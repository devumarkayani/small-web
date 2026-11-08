import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './site.schema';
import { CreateSiteDto } from './dto/create-site.dto';

export function htmlToText(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private model: Model<SiteDocument>) {}
  async findByAddress(address: string) {
    const normalized = address.toLowerCase().trim();
    const site = await this.model.findOne({ address: normalized }).lean();
    if (!site) throw new NotFoundException(`No site exists at ${normalized}.`);
    return site;
  }
  async create(dto: CreateSiteDto) {
    const address = dto.address.toLowerCase().trim();
    if (await this.model.exists({ address })) throw new ConflictException('That address is already published.');
    return this.model.create({ ...dto, address, textContent: htmlToText(dto.html) });
  }
  async all() { return this.model.find({}, { address: 1, title: 1, author: 1 }).sort({ address: 1 }).lean(); }
}
