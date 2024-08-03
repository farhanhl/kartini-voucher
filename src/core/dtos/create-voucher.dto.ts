import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsInt()
  @Min(1)
  numGenerations: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
