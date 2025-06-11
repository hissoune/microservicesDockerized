import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../gurds/roles.guard';
import { Roles } from '../gurds/roles.decorator';
import { PermissionsGuard } from '../gurds/permissions.guard';
import { Permissions } from '../gurds/permisions.decorator';


@Controller('user')
// @UseGuards(AuthGuard('keycloak') ,RolesGuard,PermissionsGuard)

export class UserController {
  private readonly logtail: any;
  constructor(private readonly userService: UserService,
     @InjectMetric('api_request_count') private counter: Counter<string>,
  ) {}
  

  @Post()
 async create(@Body() createUserDto: CreateUserDto) {
        this.counter.inc({ method: 'POST', path: 'register' });
    try {
        const result =  await    this.userService.create(createUserDto);
        this.counter.inc({ method: 'POST', path: 'register', status: 'success' });
        return result;
      } catch (error) {
        this.counter.inc({ method: 'POST', path: 'register', status: 'failure' });
        throw error;
    }
  }

  @Post('login')
  async login(@Body() createUserDto: any) {
    this.counter.inc({ method: 'POST', path: 'login' });
   try {
    const result = await this.userService.login(createUserDto);
    this.counter.inc({ method: 'POST', path: 'login', status: 'success' });
    return result;
  } catch (error) {
    this.counter.inc({ method: 'POST', path: 'login', status: 'failure' });
    throw error;
  }
  }
 @Post('refresh_token') 
  async refreshToken(@Body() createUserDto: any) {
      // this.counter.inc({ method: 'POST', path: 'refresh_token' });
    try {
      const result = await this.userService.refreshToken(createUserDto);
      // this.counter.inc({ method: 'POST', path: 'refresh_token', status: 'success' });
      return result;
    } catch (error) {
      this.counter.inc({ method: 'POST', path: 'refresh_token', status: 'failure' });
      throw error;
    }
    }
@Roles('hhhh')
@Permissions('read','write','delete')
@Get()
findAll() {
  // this.logtail.info('🔥 Log from NestJS!', { user: 'Khali'})
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
