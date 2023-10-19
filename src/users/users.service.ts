import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { ReadAllUsersDto } from './dto/read-user.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, GroupStatus } from './entities/group.entity';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    await this.entityManager.save(user);
  }

  async findAll(query: ReadAllUsersDto) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const [data, total] = await this.usersRepository.findAndCount({
      order: { id: 'ASC' },
      take,
      skip,
    });
    const nextPage = skip + Math.min(take, total);
    return { data, nextPage };
  }

  async findBy(filter: string) {
    return this.usersRepository.find({
      where: [{ name: Like(`${filter}`) }, { email: Like(`${filter}`) }],
    });
  }

  async update(updateUserDto: UpdateUserDto[]) {
    // Make sure to run in a transaction so it cant fail in the middle.
    await this.entityManager.transaction(async (entityManager) => {
      await Promise.all(
        updateUserDto.map(async ({ id, status }) => {
          const user = await this.usersRepository.findOneBy({ id });
          user.status = status;
          entityManager.save(user);
        }),
      );
    });
  }

  async createGroup(createGroupDto: CreateGroupDto) {
    const group = new Group(createGroupDto);
    await this.entityManager.save(group);
  }

  async addUserToGroup(updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: { id: updateGroupDto.groupId },
      relations: { users: true },
    });
    const user = await this.usersRepository.findOneBy({
      id: updateGroupDto.userId,
    });
    group.users = [...group.users, user];
    group.status = GroupStatus.NOTEMPTY;
    await this.entityManager.save(group);
  }

  async removeUserFromGroup(updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: { id: updateGroupDto.groupId },
      relations: { users: true },
    });
    const newUsers = [];
    group.users.forEach((user) => {
      if (user.id !== updateGroupDto.userId) {
        newUsers.push(user);
      }
    });
    group.users = newUsers;
    if (group.users.length === 0) {
      group.status = GroupStatus.EMPTY;
    }
    await this.entityManager.save(group);
  }
}
