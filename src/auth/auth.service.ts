import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interfaces';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.userService.findById(payload.id);
  }

  async authenticate(auth: AuthDto): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(auth.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isRightPassword = await this.userService.compareHash(
      auth.password,
      user.password,
    );

    if (!isRightPassword) {
      throw new BadRequestException('invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token: await this.jwtService.sign(
        {
          sub: 'va-online',
          aud: 'access-token',
        },
        {
          header: {
            kid: 'QVJQDDOI',
            alg: 'HS256',
          },
        },
      ),
    };
  }
}
