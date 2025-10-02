import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('venue')
export class VenueController {
      constructor(
            @Inject(MICROSERVICES_CLIENTS.VENUE_SERVICE) private client: ClientProxy
      ) {}

      @Post("create-venue")
      async createVenue(@Body() data: Record<string, any>, @Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("create-venue", data))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch(error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }

      @Get()
      async getVenues(@Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("get-venues", {}))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch (error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }

      @Get(":id")
      async getVenueById(@Param("id") id: string, @Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("get-venue-by-id", id))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch (error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }

      @Get(":name")
      async getVenueByName(@Param("name") id: string, @Res() res: Response) {
            try {
                  const result = await firstValueFrom(this.client.send("get-venue-by-name", name))

                  return res.status(HttpStatus.OK).json({success: true, data: result})
            } catch (error) {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error})
            }
      }
}
