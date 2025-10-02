import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Venue, VenueSchema } from './schemas/venueSchema';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';

@Module({
      imports: [
            MongooseModule.forFeature([
                  {
                        name: Venue.name,
                        schema: VenueSchema
                  }
            ])
      ],
      providers: [
            VenueService
      ],
      controllers: [
            VenueController
      ]
})
export class VenueModule {}
