import { Controller } from '@nestjs/common';
import { CourierService } from './courier.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SetDeliveryHoursDto } from './dtos/deliveryHours.dto';

@Controller('courier')
export class CourierController {
      constructor(
            private courierService: CourierService
      ) {}

      @MessagePattern("set-delivery-hours")
      async setDeliveryHours(@Payload() data: SetDeliveryHoursDto) {
            return this.courierService.setDeliveryHours(data)
      }

      @MessagePattern("get-delivery-hours-by-city")
      async getDeliveryHoursByCity(@Payload() city: string) {
            return this.courierService.getDeliveryHoursByCity(city)
      }
}
