import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Group } from './group.entity';

export enum UserStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @ManyToOne(() => Group, (group) => group.users)
  group: Group;
}
