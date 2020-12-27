import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from './JwtPayloadInterface';
import { UserRepository } from './user.repository';
import * as config from 'config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate({ username }: JwtPayloadInterface) {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('');
    }

    return user;
  }
}
