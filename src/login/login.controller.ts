import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(
    @Body() body: { username: string; password: string }
  ) {
    const { username, password } = body;

    if (!username || !password) {
      throw new HttpException('Debe ingresar usuario y contraseña', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.loginService.validateUser(username, password);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
