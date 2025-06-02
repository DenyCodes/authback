// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';  // <-- Importar aqui

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signUp(email, password);
  }

  @Post('signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signIn(email, password);
  }

@Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas');
  }
  return this.authService.login(user);
}

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
