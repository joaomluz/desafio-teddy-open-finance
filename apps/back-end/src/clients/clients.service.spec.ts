import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createDto = {
        name: 'John Doe',
        salary: 3500.0,
        companyValue: 120000.0,
      };

      const client = { 
        id: '1', 
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      mockRepository.create.mockReturnValue(client);
      mockRepository.save.mockResolvedValue(client);

      const result = await service.create(createDto);

      expect(result).toEqual(client);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(client);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const client = {
        id: '1',
        name: 'John Doe',
        salary: 3500.0,
        companyValue: 120000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findOne.mockResolvedValue(client);

      const result = await service.findOne('1');

      expect(result).toEqual(client);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});

