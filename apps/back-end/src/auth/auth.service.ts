import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Não bloqueia a inicialização - executa em background
    // O banco pode não estar pronto imediatamente
    this.initializeDefaultUser().catch((error) => {
      console.error('❌ Erro ao inicializar usuário padrão (não crítico):', error.message);
      // Tenta novamente após 5 segundos se falhou
      setTimeout(() => {
        this.initializeDefaultUser().catch((retryError) => {
          console.error('❌ Erro ao inicializar usuário padrão (tentativa 2):', retryError.message);
        });
      }, 5000);
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        console.log(`❌ Usuário não encontrado: ${email}`);
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`❌ Senha inválida para: ${email}`);
        return null;
      }
      
      const { password: _, ...result } = user;
      console.log(`✅ Usuário validado: ${email}`);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao validar usuário: ${error.message}`, error);
      return null;
    }
  }

  async login(user: any) {
    try {
      if (!user || !user.id || !user.email) {
        throw new Error('Dados do usuário inválidos');
      }

      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      
      console.log(`✅ Token JWT gerado para: ${user.email}`);
      
      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      console.error(`❌ Erro ao fazer login: ${error.message}`, error);
      throw error;
    }
  }

  private async initializeDefaultUser() {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: 'admin@example.com' },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const defaultUser = this.usersRepository.create({
          email: 'admin@example.com',
          password: hashedPassword,
        });
        await this.usersRepository.save(defaultUser);
        console.log('✅ Usuário padrão criado: admin@example.com');
      }
    } catch (error) {
      console.error('❌ Erro ao criar usuário padrão:', error);
      // Não lança erro para não quebrar a aplicação
    }
  }
}