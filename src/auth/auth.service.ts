import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCrendentialsDTO } from './dtos/AuthCrendentialsDTO';
import { JwtPayloadInterface } from './JwtPayloadInterface';

import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService', true);

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp({ username, password }: AuthCrendentialsDTO): Promise<void> {
    return this.userRepository.signUp({ username, password });
  }

  async signIn({
    username,
    password,
  }: AuthCrendentialsDTO): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validateUserPassword({
      username,
      password,
    });

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayloadInterface = { username };
    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
