export interface User {
  id: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  viewCount?: number;
}

export interface CreateClientDto {
  name: string;
  salary: number;
  companyValue: number;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  deletedClients: number;
  recentClients: Client[];
  clientsByMonth: { month: string; count: number }[];
}

