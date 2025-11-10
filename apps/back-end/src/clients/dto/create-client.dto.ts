import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 3500.0, description: 'Salário do cliente' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  salary: number;

  @ApiProperty({ example: 120000.0, description: 'Valor da empresa do cliente' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  companyValue: number;
}

