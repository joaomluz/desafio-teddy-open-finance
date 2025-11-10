import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}

