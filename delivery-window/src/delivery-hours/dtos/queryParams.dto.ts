import { IsString } from "class-validator"


export class DeliveryWindowQueryDto {
      @IsString()
      city: string

      @IsString()
      venueId: string
}