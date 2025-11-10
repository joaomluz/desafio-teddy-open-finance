import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create({
      ...createClientDto,
      salary: Number(createClientDto.salary),
      companyValue: Number(createClientDto.companyValue),
    });
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    const updateData: any = { ...updateClientDto };
    if (updateData.salary !== undefined) {
      updateData.salary = Number(updateData.salary);
    }
    if (updateData.companyValue !== undefined) {
      updateData.companyValue = Number(updateData.companyValue);
    }
    Object.assign(client, updateData);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.softDelete(id);
  }

  async getStats() {
    const allClients = await this.clientsRepository.find({
      withDeleted: true,
    });
    const activeClients = await this.clientsRepository.find();
    const deletedClients = allClients.filter((c) => c.deletedAt);

    const recentClients = await this.clientsRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
    });

    // Agrupar por mês
    const clientsByMonth = allClients.reduce((acc, client) => {
      const month = new Date(client.createdAt).toLocaleDateString('pt-BR', {
        month: 'short',
        year: 'numeric',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clientsByMonthArray = Object.entries(clientsByMonth).map(
      ([month, count]) => ({ month, count }),
    );

    return {
      totalClients: allClients.length,
      activeClients: activeClients.length,
      deletedClients: deletedClients.length,
      recentClients,
      clientsByMonth: clientsByMonthArray,
    };
  }
}
