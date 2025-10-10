import { Controller, Get, HttpStatus, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { MICROSERVICES_CLIENTS } from 'src/constants';
import { DeliveryWindowQueryDto } from './dtos/queryParams.dto';
import { Response } from 'express';
// import { firstValueFrom } from 'rxjs';
// import { parseTimeRanges, timeAvailabilityIntersection } from 'src/utils';
// import { CIRCUIT_BREAKER_FOR } from 'src/circuit-breaker/circuit-breaker.module';
import { DeliveryHoursService } from './delivery-hours.service';

@Controller('delivery-hours')
export class DeliveryHoursController {
      constructor(
            private readonly deliveryHoursService: DeliveryHoursService
      ) {}

      @Get()
      @UsePipes(new ValidationPipe({transform: true}))
      async getDeliveryWindow(@Query() queryParams: DeliveryWindowQueryDto, @Res() res: Response) {
            try {
                  const deliveryWindows = await this.deliveryHoursService.getDeliveryWindow(queryParams.city, queryParams.venueId)
                  
                  return res.status(HttpStatus.OK).json({success: true, data: deliveryWindows})

            } catch(error) {
                  console.log(error)
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }
}
