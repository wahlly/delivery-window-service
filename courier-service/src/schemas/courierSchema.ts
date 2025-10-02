import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

class DeliveryHours {
      @Prop({required: true})
      sunday: string

      @Prop({required: true})
      monday: string

      @Prop({required: true})
      tuesday: string

      @Prop({required: true})
      wednesday: string

      @Prop({required: true})
      thursday: string

      @Prop({required: true})
      friday: string

      @Prop({required: true})
      saturday: string
} 

@Schema()
export class Courier {
      @Prop({required: true})
      city: string

      @Prop({required: true})
      deliveryHours: DeliveryHours
}

export const CourierSchema = SchemaFactory.createForClass(Courier)