import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: AuthDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }
}