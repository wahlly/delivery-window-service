import { FactoryProvider, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { VenueController } from './venue/venue.controller';
import { CourierController } from './courier/courier.controller';
import { DeliveryHoursController } from './delivery-hours/delivery-hours.controller';
import { CIRCUIT_BREAKER_FOR, CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { DeliveryHoursService } from './delivery-hours/delivery-hours.service';
import * as Opossum from "opossum"
import { firstValueFrom } from 'rxjs';

const deliveryHoursServiceProvider: FactoryProvider = {
  provide: DeliveryHoursService,
  inject: [
    MICROSERVICES_CLIENTS.VENUE_SERVICE,
    MICROSERVICES_CLIENTS.COURIER_SERVICE,
    CIRCUIT_BREAKER_FOR(MICROSERVICES_CLIENTS.VENUE_SERVICE),
    CIRCUIT_BREAKER_FOR(MICROSERVICES_CLIENTS.COURIER_SERVICE)
  ],
  useFactory: (
    courierClient: ClientProxy,
    venueClient: ClientProxy,
    courierBreaker: Opossum,
    venueBreaker: Opossum
  ) => {
    //override cmd functions of the circuit breaker
    const configuredCourierBreaker = new Opossum(
      async (pattern: string, payload: any) => firstValueFrom(courierClient.send(pattern, payload)),
      courierBreaker.options
    )
    configuredCourierBreaker.fallback(courierBreaker.fallback)

    const configuredVenueBreaker = new Opossum(
      async (pattern: string, payload: any) => firstValueFrom(venueClient.send(pattern, payload)),
      venueBreaker.options
    )
    configuredVenueBreaker.fallback(courierBreaker.fallback)

    return new DeliveryHoursService(configuredCourierBreaker, configuredVenueBreaker)
  }
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.VENUE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "venue_service_queue"
        }
      },
      {
        name: MICROSERVICES_CLIENTS.COURIER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "courier_service_queue"
        }
      }
    ]),
    CircuitBreakerModule.forClients([
      MICROSERVICES_CLIENTS.VENUE_SERVICE,
      MICROSERVICES_CLIENTS.COURIER_SERVICE
    ])
  ],
  controllers: [AppController, VenueController, CourierController, DeliveryHoursController],
  providers: [AppService, DeliveryHoursService, deliveryHoursServiceProvider],
})
export class AppModule {}
