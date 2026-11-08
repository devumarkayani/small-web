import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type PersonDocument = HydratedDocument<Person>;
@Schema({ timestamps: true })
export class Person { @Prop({ required: true, unique: true }) name: string; @Prop({ default: 'reader' }) kind: string; }
export const PersonSchema = SchemaFactory.createForClass(Person);
