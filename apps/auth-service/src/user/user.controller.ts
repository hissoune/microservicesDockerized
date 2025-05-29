import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../gurds/roles.decorator';
import { RolesGuard } from '../gurds/roles.guard';

@Controller('user')
// @UseGuards(AuthGuard('keycloak') ,RolesGuard)

export class UserController {
  private readonly logtail: any;
  constructor(private readonly userService: UserService) {
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {   
    console.log("gfnghngd",createUserDto);
     
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }
// @Roles('hhh')
@Get()
findAll() {
  this.logtail.info('🔥 Log from NestJS!', { user: 'Khali'})
  return this.userService.findAll();
}
 
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id); 
  } 
}
