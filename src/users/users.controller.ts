import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('test-db')
  testDb() {
    return this.usersService.testDb();
  }
@Get(':id')
@UseGuards(JwtAuthGuard)
async findOne(@Param('id') id: string, @Request() req) {
  const numericId = parseInt(id);
  if (isNaN(numericId)) throw new BadRequestException('ID inválido');

  const user = await this.usersService.findOne(numericId);

  if (req.user.role !== 'admin' && req.user.id !== numericId) {
    throw new ForbiddenException('Você não pode acessar esse usuário');
  }

  return user;
}



  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Protegida com JWT (opcional, ativa se já tiver auth configurado)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin')
// @UseGuards(JwtAuthGuard)
@Get()
findAll(@Request() req) {
  return this.usersService.findAll();
}


}
