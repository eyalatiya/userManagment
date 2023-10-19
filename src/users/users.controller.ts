import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseArrayPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadAllUsersDto } from './dto/read-user.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('search/:filter')
  findBy(@Param('filter') filter: string) {
    return this.usersService.findBy(filter);
  }

  @Get()
  findAll(@Body() readAllUsers: ReadAllUsersDto) {
    return this.usersService.findAll(readAllUsers);
  }

  @Patch()
  update(
    @Body(new ParseArrayPipe({ items: UpdateUserDto }))
    updateUserDto: UpdateUserDto[],
  ) {
    // Can be done in a custom pipe
    if (updateUserDto.length > 500) {
      throw new HttpException(
        'Can only update 500 at a time',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.update(updateUserDto);
  }

  // Since groups and users are closely linked I decided to keep them in the same controller
  @Post('group')
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.usersService.createGroup(createGroupDto);
  }

  @Patch('group/add')
  addToGroup(@Body() updateGroupDto: UpdateGroupDto) {
    return this.usersService.addUserToGroup(updateGroupDto);
  }

  @Patch('group/remove')
  removeUserFromGroup(@Body() updateGroupDto: UpdateGroupDto) {
    return this.usersService.removeUserFromGroup(updateGroupDto);
  }
}
