import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRestaurantDto {
  // restaurant info

  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bussinessPhone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bussinessEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zipCode: string;


  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      monday: '9:00-17:00',
      tuesday: '9:00-17:00',
      // ... other days
    }
  })
  businessHours: any;

  // restaurantServices : Array<;
}
