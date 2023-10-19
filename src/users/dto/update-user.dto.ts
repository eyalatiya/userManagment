import { UserStatus } from '../entities/user.entity';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  id: number;
  @IsEnum(UserStatus, { message: 'Invalid user status!' })
  status: UserStatus;
}
