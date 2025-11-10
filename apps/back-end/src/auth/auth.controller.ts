import { Controller, Post, Body, UseGuards, Request, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    try {
      this.logger.log(`Tentativa de login para: ${req.user?.email || 'unknown'}`);
      const result = await this.authService.login(req.user);
      this.logger.log(`Login bem-sucedido para: ${req.user?.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro no login: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  async getProfile(@Request() req) {
    try {
      // req.user é preenchido pelo JwtAuthGuard após validação do token
      return {
        id: req.user.id,
        email: req.user.email,
      };
    } catch (error) {
      this.logger.error(`Erro ao obter perfil: ${error.message}`, error.stack);
      throw error;
    }
  }
}

