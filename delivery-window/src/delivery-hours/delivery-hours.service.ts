import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as Opossum from "opossum"
import { firstValueFrom } from 'rxjs';
import { CIRCUIT_BREAKER_FOR } from 'src/circuit-breaker/circuit-breaker.module';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { parseTimeRanges, timeAvailabilityIntersection } from 'src/utils';

@Injectable()
export class DeliveryHoursService {
      constructor(
            // @Inject(MICROSERVICES_CLIENTS.VENUE_SERVICE)
            // private venueServiceClient: ClientProxy,

            // @Inject(MICROSERVICES_CLIENTS.COURIER_SERVICE)
            // private courierServiceClient: ClientProxy,

            @Inject(CIRCUIT_BREAKER_FOR(MICROSERVICES_CLIENTS.VENUE_SERVICE))
            private readonly venueServiceBreaker: Opossum,

            @Inject(CIRCUIT_BREAKER_FOR(MICROSERVICES_CLIENTS.COURIER_SERVICE))
            private readonly courierServiceBreaker: Opossum
      ) {}

      async getDeliveryWindow(cityName: string, venueId: string): Promise<any> {
            try {
                  const [venueRes, cityRes] = await Promise.allSettled([
                  this.venueServiceBreaker.fire("get-venue-by-id", venueId),
                  this.courierServiceBreaker.fire("get-delivery-hours-by-city", cityName)
                  ])
                  console.log(venueRes.status, " ", cityRes.status)
                  if (venueRes?.status === "rejected" || cityRes?.status === "rejected") {
                        let errMessages: string[] = []
                        if (venueRes.status == "rejected") {
                              errMessages.push("Venue service is unavailable")
                        }
                        if (cityRes.status == "rejected") {
                              errMessages.push("Courier service is unavailable")
                        }
                        throw new Error(errMessages.join(","))
                  }
// console.log("venue: ", venue)
// console.log("city: ", city)
            const venue = venueRes.value
            const city = cityRes.value
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
console.log("dw: ", deliveryWindows)
            return deliveryWindows
            } catch (error) {
                  throw new Error(error)
            }
      }
}
