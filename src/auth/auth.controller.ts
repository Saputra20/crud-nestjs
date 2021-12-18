import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) auth: AuthDto): Promise<string> {
    return this.authService.authenticate(auth);
  }
}
