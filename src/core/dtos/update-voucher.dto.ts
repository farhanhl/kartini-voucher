import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateVoucherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  numGenerations: number;
}
