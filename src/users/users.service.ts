import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from './database/prisma.module';
import { hash } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    // NÃO FAZER hash aqui, já está feito no AuthService
    const userCreated = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password, // já criptografada
        role: createUserDto.role || 'user',
      },
    });
    return userCreated;
  }

  async findOne(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      refreshToken: true
    }
  });

  return user;
}


  async update(id: number, updateUserDto: UpdateUserDto) {
    // Se vier senha, criptografa aqui, pois é update direto
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, "10");
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          refreshToken: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async testDb() {
    const users = await this.prisma.user.findMany();
    console.log('Users:', users);
    return users;
  }
}
