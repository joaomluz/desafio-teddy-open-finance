import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MetricsService } from '../metrics/metrics.service';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  async create(@Body() createClientDto: CreateClientDto) {
    const client = await this.clientsService.create(createClientDto);
    // Converter decimais para números
    return {
      ...client,
      salary: parseFloat(client.salary as any),
      companyValue: parseFloat(client.companyValue as any),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  async findAll() {
    const clients = await this.clientsService.findAll();
    // Converter decimais para números
    return clients.map(client => ({
      ...client,
      salary: parseFloat(client.salary as any),
      companyValue: parseFloat(client.companyValue as any),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do cliente' })
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);
    await this.metricsService.incrementViewCount(id);
    const viewCount = await this.metricsService.getViewCount(id);
    // Converter decimais para números
    return {
      ...client,
      salary: parseFloat(client.salary as any),
      companyValue: parseFloat(client.companyValue as any),
      viewCount,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    const client = await this.clientsService.update(id, updateClientDto);
    // Converter decimais para números
    return {
      ...client,
      salary: parseFloat(client.salary as any),
      companyValue: parseFloat(client.companyValue as any),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cliente (soft delete)' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
