import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LogtailService } from '../logtail/logtail.service';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
  private usersRepository: Repository<User>,
   private readonly loggService : LogtailService
) {}

 async create(createUserDto:any) {
     try {
      const newuser = await this.usersRepository.save(createUserDto);
        this.loggService.info(`user with id ${newuser.id} is created `, { user: createUserDto });
         return newuser;
     } catch (error) {
      this.loggService.error(`error while creating user`, { error });
      throw new Error('Error creating user'); 
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
