import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('courier')
export class CourierController {
      constructor(
            @Inject(MICROSERVICES_CLIENTS.COURIER_SERVICE) private client: ClientProxy
      ) {}

      @Post("set-delivery-hours")
      async setDeliveryHours(@Body() data: Record<string, any>, @Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("set-delivery-hours", data))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch(error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }

      @Get("cities/:city/delivery-hours")
      async getDeliveryHoursByCity(@Param("city") city: string, @Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("get-delivery-hours-by-city", city))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch(error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }
}
