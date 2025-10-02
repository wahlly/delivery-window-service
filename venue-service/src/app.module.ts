import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VenueController } from './venue/venue.controller';
import { VenueService } from './venue/venue.service';
import { VenueModule } from './venue/venue.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/delivery-window"),
    VenueModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
