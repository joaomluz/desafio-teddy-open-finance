import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewCount } from './entities/view-count.entity';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private clientViewsCounter: Counter;

  constructor(
    @InjectRepository(ViewCount)
    private viewCountRepository: Repository<ViewCount>,
  ) {
    // Inicializar contador Prometheus
    this.clientViewsCounter = new Counter({
      name: 'client_views_total',
      help: 'Total number of views per client',
      labelNames: ['client_id'],
      registers: [register],
    });
  }

  async incrementViewCount(clientId: string): Promise<void> {
    // Incrementar no Prometheus
    this.clientViewsCounter.inc({ client_id: clientId });

    // Atualizar no banco de dados
    let viewCount = await this.viewCountRepository.findOne({
      where: { clientId },
    });

    if (!viewCount) {
      viewCount = this.viewCountRepository.create({
        clientId,
        count: 0,
      });
    }

    viewCount.count += 1;
    await this.viewCountRepository.save(viewCount);
  }

  async getViewCount(clientId: string): Promise<number> {
    const viewCount = await this.viewCountRepository.findOne({
      where: { clientId },
    });
    return viewCount ? viewCount.count : 0;
  }
}
