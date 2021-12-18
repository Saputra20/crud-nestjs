import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = config.get('app.salt_rounds', 10);
  }

  async create(user: CreateUserDto): Promise<User> {
    const userToCreate = {
      ...user,
      password: await this.getHash(user.password),
    };

    const result = await this.userRepo.save(this.userRepo.create(userToCreate));

    return result;
  }

  async update(userEntity: User, user: UpdateUserDto): Promise<User> {
    return await this.userRepo.save({
      ...userEntity,
      name: user.name,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'email', 'password'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepo.findOneOrFail(id);
  }

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
