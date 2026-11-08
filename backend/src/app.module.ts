import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesModule } from './sites/sites.module';
import { HistoryModule } from './history/history.module';
import { PeopleModule } from './people/people.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/small_web'), SitesModule, HistoryModule, PeopleModule, SearchModule],
})
export class AppModule {}
