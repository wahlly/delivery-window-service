import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Courier } from 'src/schemas/courierSchema';
import { SetDeliveryHoursDto } from './dtos/deliveryHours.dto';

@Injectable()
export class CourierService {
      constructor(
            @InjectModel(Courier.name) private courierModel: Model<Courier>
      ) {}

      async setDeliveryHours(data: SetDeliveryHoursDto){
            const existingCity = await this.courierModel.findOne({city: data.city})
            console.log("city: ", existingCity)
            if(existingCity){
                  throw new Error("delivery hours are already set for the city")
            }

            const newCity = await this.courierModel.create(data)
            return newCity
      }

      async getDeliveryHoursByCity(city: string) {
            return this.courierModel.findOne({city: city})
      }
}
