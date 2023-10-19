import { IsNumber } from 'class-validator';

export class UpdateGroupDto {
  @IsNumber()
  groupId: number;
  @IsNumber()
  userId: number;
}
