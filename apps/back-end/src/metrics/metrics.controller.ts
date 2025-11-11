import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';

// Coletar métricas padrão do Node.js (CPU, memória, etc.)
collectDefaultMetrics({ register });

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Métricas Prometheus' })
  async getMetrics(@Res() res: Response): Promise<void> {
    try {
      const metrics = await register.metrics();
      res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.end(metrics || '# No metrics available\n');
    } catch (error: any) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.status(500).end(`# Error collecting metrics: ${error?.message || 'Unknown error'}\n`);
    }
  }
}
