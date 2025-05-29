import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LogtailService } from '../logtail/logtail.service';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
  private usersRepository: Repository<User>,
   private readonly loggService : LogtailService,
   @Inject('N8N_SERVICE')  private readonly n8nService :ClientProxy
) {}

 private keycloakUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCKLOAK_REALM}/protocol/openid-connect/token`;
  private keycloakAdminUrl = `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCKLOAK_REALM}/users`;
  private clientId = process.env.KEYCLOAK_CLIENT_ID ;
  private clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  private grantType = process.env.KEYCLOAK_GRANT_TYPE ;
  private grantTypeAdmin = process.env.KEYCLOAK_GRANT_TYPE_ADMIN ;



   async getAdminToken(): Promise<string> {
    try {
      const response = await axios.post(
        this.keycloakUrl,
        new URLSearchParams({
          grant_type: this.grantTypeAdmin || 'client_credentials',
          client_id: this.clientId || 'admin-cli',
          client_secret:  this.clientSecret || 'your-client-secret',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      return response.data.access_token;
    } catch (error) {
      throw new HttpException('Failed to get admin token', 500);
    }
  }


 async create(createUserDto:any) {

try{
        const token = await this.getAdminToken();
        const response = await axios.post(
          this.keycloakAdminUrl,
          {
              username: createUserDto.name,
              email: createUserDto.email,
              enabled: true,
              emailVerified: true,
              credentials: [
                {
                  type: 'password',
                  value: createUserDto.password,
                  temporary: false,
                },
              ],
            },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
 

        console.log("User created successfully:", response);
        
      const newuser = await this.usersRepository.save(createUserDto);
        this.loggService.info(`user with id ${newuser.id} is created `, {
              userId: newuser.id,
              email: newuser.email,
              timestamp: new Date().toISOString(),
              service: 'UserService',
              method: 'create',
            });
        this.n8nService.emit('user_created', newuser);
         return newuser;
    
     } catch (error) {
      this.loggService.error(`error while creating user`, { error });
      throw new Error('Error creating user'); 
     }
   
  }

  async login(createUserDto: any) {
    try {
      const response = await axios.post(
        this.keycloakUrl,
        new URLSearchParams({
          grant_type: this.grantType || 'password',
          client_id: this.clientId || 'your-client-id',
          client_secret: this.clientSecret || 'your-client-secret',
          username: createUserDto.name,
          password: createUserDto.password,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      if (response.data.access_token) {
        this.loggService.info(`User ${createUserDto.name} logged in successfully`, {
          user: createUserDto.name,
          timestamp: new Date().toISOString(),
          service: 'UserService',
          method: 'login',
        });
        return response.data;
      } else {
        throw new HttpException('Invalid credentials', 401);
      }
    } catch (error) {
      this.loggService.error(`Login failed for user ${createUserDto.name}`, {
        error: error.message,
        user: createUserDto.name,
        timestamp: new Date().toISOString(),
        service: 'UserService',
        method: 'login',
      });
      throw new HttpException('Login failed', 500);
    }
  }

 async findAll() {
   
  
    return await this.usersRepository.find({where:{name:"2"}})
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });
  
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
  
    return this.usersRepository.save(user);
  }
  

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
