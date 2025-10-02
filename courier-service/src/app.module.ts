import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourierModule } from './courier/courier.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/delivery-window"),
    CourierModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
