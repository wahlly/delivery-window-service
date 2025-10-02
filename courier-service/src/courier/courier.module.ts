import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Courier, CourierSchema } from 'src/schemas/courierSchema';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';

@Module({
      imports: [
            MongooseModule.forFeature([
                  {
                        name: Courier.name,
                        schema: CourierSchema
                  }
            ])
      ],
      controllers: [CourierController],
      providers: [CourierService]
})
export class CourierModule {}
