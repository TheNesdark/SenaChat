import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException,  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) throw new UnauthorizedException('Credenciales inválidas');
      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.authService.register(registerDto.name, registerDto.email, registerDto.password);
      return { message: 'Usuario registrado con éxito' }
    } catch (error) {
      throw error
  }
}
}