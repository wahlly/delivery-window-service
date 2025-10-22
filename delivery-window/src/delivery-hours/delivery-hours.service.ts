import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// import { CircuitBreakerInterceptor } from 'src/common/interceptors/circuit-breaker.interceptor';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { parseTimeRanges, timeAvailabilityIntersection } from 'src/utils';

@Injectable()
export class DeliveryHoursService {
      constructor(
            @Inject(MICROSERVICES_CLIENTS.VENUE_SERVICE) private venueServiceClient: ClientProxy,
            @Inject(MICROSERVICES_CLIENTS.COURIER_SERVICE) private courierServiceClient: ClientProxy
      ) {}

      // @UseInterceptors(CircuitBreakerInterceptor)
      async getDeliveryWindows(venueId: string, cityName: string) {
            const [venueResult, cityResult] = await Promise.allSettled([
                  firstValueFrom(this.venueServiceClient.send("get-venue-by-id", venueId)),
                  firstValueFrom(this.courierServiceClient.send("get-delivery-hours-by-city", cityName))
            ])

            if(venueResult.status == "fulfilled" && cityResult.status == "fulfilled") {
                  const venue = venueResult.value
                  const city = cityResult.value
                  
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
                  return deliveryWindows
            }

            const errorMessage = venueResult.status == "rejected" && cityResult.status == "rejected"
                  ? "venue service and city service are unavailable"
                  : venueResult.status == "rejected" ? "venue service is unavailable"
                  : "city service is unavailable"
            
            throw new Error(errorMessage)
      }
}
