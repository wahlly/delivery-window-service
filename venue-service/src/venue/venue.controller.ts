import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dtos/createVenue.dto';

@Controller()
export class VenueController {
      constructor(
            private venueService: VenueService
      ) {}

      @MessagePattern("create-venue")
      async createVenue(@Payload() data: CreateVenueDto) {
            return this.venueService.createVenue(data)
      }

      @MessagePattern("get-venues")
      async getVenues() {
            return this.venueService.getVenues()
      }

      @MessagePattern("get-venue-by-id")
      async getVenueById(@Payload() id: string) {
            return this.venueService.getVenueById(id)
      }

      @MessagePattern("get-venue-by-name")
      async getVenueByName(@Payload() name: string) {
            return this.venueService.getVenueByName(name)
      }
}
