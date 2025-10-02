import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

class OpeningHours {
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
export class Venue {
      @Prop({required: true})
      name: string

      @Prop({required: true})
      openingHours: OpeningHours
}

export const VenueSchema = SchemaFactory.createForClass(Venue)