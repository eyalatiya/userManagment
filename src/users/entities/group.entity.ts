import { BaseEntity } from 'src/database/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum GroupStatus {
  EMPTY = 'empty',
  NOTEMPTY = 'notEmpty',
}

// Again since these entities are so closely link Im keeping the group entity under the user resource
@Entity()
export class Group extends BaseEntity<Group> {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.EMPTY,
  })
  status: GroupStatus;

  @OneToMany(() => User, (user) => user.group, { cascade: true })
  users: User[];
}
