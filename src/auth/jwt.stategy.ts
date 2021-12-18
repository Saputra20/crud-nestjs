import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { JwtPayloadInterface } from './interfaces';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
