import { IsNotEmpty, IsString } from "class-validator";


export class CreateVenueDto {
      @IsNotEmpty()
      @IsString()
      name: string

      @IsNotEmpty()
      openingHours: {
            "sunday": string
            "monday": string
            "tuesday": string
            "wednesday": string
            "thursday": string
            "friday": string
            "saturday": string
      }
}