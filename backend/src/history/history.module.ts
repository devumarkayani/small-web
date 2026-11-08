import { Module } from '@nestjs/common'; import { MongooseModule } from '@nestjs/mongoose'; import { Visit, VisitSchema } from './visit.schema'; import { HistoryController } from './history.controller';
@Module({ imports: [MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }])], controllers: [HistoryController] }) export class HistoryModule {}
