import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './site.schema';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
@Module({ imports: [MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }])],
 controllers: [SitesController],
  providers: [SitesService],
   exports: [SitesService, MongooseModule] })
export class SitesModule {}
