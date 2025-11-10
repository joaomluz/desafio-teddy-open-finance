import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  @ApiOperation({ summary: 'Health check endpoint' })
  healthz() {
    return this.appService.healthz();
  }
}

