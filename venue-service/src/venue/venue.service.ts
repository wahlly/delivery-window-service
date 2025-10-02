import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Venue } from './schemas/venueSchema';
import { Model } from 'mongoose';
import { CreateVenueDto } from './dtos/createVenue.dto';

@Injectable()
export class VenueService {
      constructor(
            @InjectModel(Venue.name) private venueModel: Model<Venue>
      ) {}

      async createVenue(venue: CreateVenueDto)  {
            const existingVenue = await this.venueModel.findOne({name: venue.name})
            if(existingVenue){
                  throw new Error("venue already exist")
            }

            const newVenue = await this.venueModel.create(venue)
            return newVenue
      }

      async getVenues() {
            const venues = await this.venueModel.find()
            return venues
      }

      async getVenueById(id: string) {
            const venue = await this.venueModel.findById(id)
            return venue
      }

      async getVenueByName(name: string) {
            const venue = await this.venueModel.findOne({name: name})
            return venue
      }

      async updateVenue(data: CreateVenueDto, venueId: string) {
            const venue = await this.venueModel.findById(venueId)
            if(!venue) {
                  throw new Error("invalid venueId")
            }

            venue.name = data.name
            venue.openingHours = data.openingHours
            await venue.save()

            return venue
      }

      async deleteVenue(venueId: string) {
            return await this.venueModel.deleteOne({_id: venueId})
      }
}
