import { IsNotEmpty, IsString } from "class-validator"


export class SetDeliveryHoursDto {
      @IsNotEmpty()
      @IsString()
      city: string

      @IsNotEmpty()
      deliveryHours: {
            "sunday": string
            "monday": string
            "tuesday": string
            "wednesday": string
            "thursday": string
            "friday": string
            "saturday": string
      }
}