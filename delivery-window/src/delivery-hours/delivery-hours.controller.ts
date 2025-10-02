import { Controller, Get, HttpStatus, Inject, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { DeliveryWindowQueryDto } from './dtos/queryParams.dto';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { parseTimeRanges, timeAvailabilityIntersection } from 'src/utils';

@Controller('delivery-hours')
export class DeliveryHoursController {
      constructor(
            @Inject(MICROSERVICES_CLIENTS.VENUE_SERVICE) private venueServiceClient: ClientProxy,
            @Inject(MICROSERVICES_CLIENTS.COURIER_SERVICE) private courierServiceClient: ClientProxy
      ) {}

      @Get()
      @UsePipes(new ValidationPipe({transform: true}))
      async getDeliveryWindow(@Query() queryParams: DeliveryWindowQueryDto, @Res() res: Response) {
            try {
                  const venue = await firstValueFrom(this.venueServiceClient.send("get-venue-by-id", queryParams.venueId))
                  const city = await firstValueFrom(this.courierServiceClient.send("get-delivery-hours-by-city", queryParams.city))

                  const deliveryWindows = {}
                  for (const day in venue.openingHours) {
                        let availableWindow: string
                        if(venue.openingHours[day] == "anytime") {
                              availableWindow = city.deliveryHours[day]
                        }
                        if(city.deliveryHours[day] == "anytime") {
                              availableWindow = venue.openingHours[day]
                        }

                        if(venue.openingHours[day] == "closed" || city.deliveryHours[day] == "closed") {
                              availableWindow = "Closed"
                        } else{
                              const venueTimeRange = parseTimeRanges(venue.openingHours[day])
                              const courierTimeRange = parseTimeRanges(city.deliveryHours[day])
                              let intersection = timeAvailabilityIntersection(venueTimeRange, courierTimeRange)
                              if (intersection == "") {
                                    intersection = "closed"
                              }
                              availableWindow = intersection
                        }
                        //set available time ranges for the day
                        deliveryWindows[day] = availableWindow
                  }
                  
                  return res.status(HttpStatus.OK).json({success: true, data: deliveryWindows})

            } catch(error) {
                  console.log(error)
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }
}
