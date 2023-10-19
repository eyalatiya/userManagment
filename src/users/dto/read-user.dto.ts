import { IsNumber, IsOptional, Max } from 'class-validator';

export class ReadAllUsersDto {
  @IsNumber()
  @IsOptional()
  skip?: number;
  @IsNumber()
  @IsOptional()
  @Max(20)
  take?: number;
}
