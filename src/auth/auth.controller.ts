import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCrendentialsDTO } from './dtos/AuthCrendentialsDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) { username, password }: AuthCrendentialsDTO,
  ): Promise<void> {
    return this.authService.signUp({ username, password });
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) { username, password }: AuthCrendentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn({ username, password });
  }
}
