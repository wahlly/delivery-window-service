import { Controller, Get, HttpStatus, Inject, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeliveryWindowQueryDto } from './dtos/queryParams.dto';
import { Response } from 'express';
import { DeliveryHoursService } from './delivery-hours.service';

@Controller('delivery-hours')
export class DeliveryHoursController {
      constructor(
            private deliveryHoursService: DeliveryHoursService
      ) {}

      @Get()
      @UsePipes(new ValidationPipe({transform: true}))
      async getDeliveryWindow(@Query() queryParams: DeliveryWindowQueryDto, @Res() res: Response) {
            try {
                  const deliveryWindows = await this.deliveryHoursService.getDeliveryWindows(queryParams.venueId, queryParams.city)
                  
                  res.status(HttpStatus.OK).json({success: true, data: deliveryWindows})

            } catch(error) {
                  console.log(error)
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }
}
