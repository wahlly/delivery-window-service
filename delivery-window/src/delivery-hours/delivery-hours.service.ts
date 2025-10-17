import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CircuitBreakerStrategy, ResilienceFactory, UseResilience } from 'nestjs-resilience';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Injectable()
export class DeliveryHoursService {
      constructor(
            @Inject(MICROSERVICES_CLIENTS.VENUE_SERVICE) private readonly venueServiceClient: ClientProxy,
            @Inject(MICROSERVICES_CLIENTS.COURIER_SERVICE) private readonly courierServiceClient: ClientProxy
      ) {}

      @UseResilience(new CircuitBreakerStrategy({}), ResilienceFactory.createFallbackStrategy(() => console.log("kkkk")))
      async callVenueServiceClient(data: any): Promise<any> {
            return firstValueFrom(this.venueServiceClient.send("get-venue-by-id", data))
      }

      async callCourierServiceClient(data: any): Promise<any> {
            return firstValueFrom(this.courierServiceClient.send("get-delivery-hours-by-city", data))
      }
}
