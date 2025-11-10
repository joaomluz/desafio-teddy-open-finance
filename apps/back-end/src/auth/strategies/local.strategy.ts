import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validando credenciais para: ${email}`);
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        this.logger.warn(`Credenciais inválidas para: ${email}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }
      this.logger.log(`Credenciais válidas para: ${email}`);
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Erro ao validar credenciais: ${error.message}`, error.stack);
      throw new UnauthorizedException('Erro ao processar login');
    }
  }
}

