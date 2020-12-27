import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { AuthCrendentialsDTO } from './dtos/AuthCrendentialsDTO';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({ username, password }: AuthCrendentialsDTO): Promise<void> {
    const salt = await bcrypt.genSalt();

    const user = this.create({
      username,
      password: await this.hashPassword(password, salt),
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword({
    username,
    password,
  }: AuthCrendentialsDTO): Promise<string> {
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, hash: string): Promise<string> {
    return bcrypt.hash(password, hash);
  }
}
