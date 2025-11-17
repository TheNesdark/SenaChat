import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (user && (await bcrypt.compare(pass, user.password))) {
        return user;
      }
      return user || null;
    } catch (error) {
      throw new InternalServerErrorException('Error al validar el usuario');
    }
  }

  async login(user: any) {
    return { access_token: this.jwtService.sign({ email: user.email, id: user.id }) };
  }

  async register(name: string, email: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserDto: RegisterDto = {
        name,
        email,
        password: hashedPassword,
      };
      await this.usersRepository.save(createUserDto);
    } catch (error) {
      throw new ConflictException('Error al registrar el usuario');
    }
  }

  async getUser(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
