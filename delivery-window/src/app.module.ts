import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { VenueController } from './venue/venue.controller';
import { CourierController } from './courier/courier.controller';
import { DeliveryHoursController } from './delivery-hours/delivery-hours.controller';

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
    ])
  ],
  controllers: [AppController, VenueController, CourierController, DeliveryHoursController],
  providers: [AppService],
})
export class AppModule {}
