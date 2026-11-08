import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type SiteDocument = HydratedDocument<Site>;
@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) address: string;
  @Prop({ required: true, trim: true, maxlength: 100 }) title: string;
  @Prop({ required: true, maxlength: 50000 }) html: string;
  @Prop({ required: true, trim: true }) author: string;
  @Prop({ required: true, index: true }) textContent: string;
}
export const SiteSchema = SchemaFactory.createForClass(Site);
SiteSchema.index({ title: 'text', textContent: 'text', address: 'text' });
