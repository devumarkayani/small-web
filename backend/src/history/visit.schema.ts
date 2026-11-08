import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument } from 'mongoose';
export type VisitDocument = HydratedDocument<Visit>;
@Schema({ timestamps: true }) export class Visit {
 @Prop({ required: true, index: true }) personId: string;
 @Prop({ required: true }) personName: string;
 @Prop({ required: true, index: true }) address: string;
 @Prop({ required: true }) title: string;
 @Prop({ required: true, enum: ['typed','link','history','restore'] }) method: string;
 @Prop({ required: true, default: Date.now }) visitedAt: Date;
}
export const VisitSchema = SchemaFactory.createForClass(Visit);
VisitSchema.index({ personId: 1, visitedAt: -1 });
