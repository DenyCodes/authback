import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

export interface IUser {
  id: number;
  name: string | null;
  email: string;
  password: string;
  role: string;
  refreshToken?: string | null;
}

@Injectable()
export class AuthService {
  async login(user: IUser) {
  const payload = { email: user.email, sub: user.id, role: user.role };
  const accessToken = await this.jwtService.signAsync(payload, {
    expiresIn: '60s',
  });

  return {
    access_token: accessToken,
    user,
  };
}

  // src/auth/auth.service.ts (exemplo)
async validateUser(email: string, password: string): Promise<User | null> {
  const user = await this.usersService.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name: undefined,
      role: '',
    });

    const { password: _, refreshToken, ...result } = user;
    return result;
  }

async signIn(email: string, password: string) {
  console.log('Tentativa de login com email:', email);
  
  const user = await this.usersService.findByEmail(email);
  if (!user) {
    console.log('Usuário não encontrado');
    throw new UnauthorizedException('Credenciais inválidas');
  }

  const isPasswordValid = await compare(password, user.password);
  console.log('Senha válida?', isPasswordValid);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  const payload = { sub: user.id, email: user.email, role: user.role };

  const accessToken = await this.jwtService.signAsync(payload, {
    expiresIn: '60s',
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    expiresIn: '7d',
    secret: process.env.JWT_REFRESH_SECRET,
  });

  await this.usersService.update(user.id, { refreshToken });

  return { accessToken, refreshToken };
}


  async refresh(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findOne(decoded.sub);

      if (!user || user.refreshToken !== refreshToken) { 
        throw new UnauthorizedException('Refresh token inválido');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: '60s' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
  
}
