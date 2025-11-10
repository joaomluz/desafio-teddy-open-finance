import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/shared/lib/api';
import { DashboardStats, Client } from '@/shared/types';
import './DashboardPage.css';

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get<DashboardStats>('/dashboard/stats');
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error || !stats) {
    return <div className="error">{error || 'Erro ao carregar dados'}</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-label">Total de Clientes</div>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeClients}</div>
            <div className="stat-label">Clientes Ativos</div>
          </div>
        </div>

        <div className="stat-card deleted">
          <div className="stat-icon">🗑️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.deletedClients}</div>
            <div className="stat-label">Clientes Excluídos</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h2>Clientes por Mês</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.clientsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-clients-section">
          <div className="section-header">
            <h2>Últimos Clientes</h2>
            <Link to="/clients" className="btn-link">
              Ver todos →
            </Link>
          </div>
          {stats.recentClients.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum cliente cadastrado ainda</p>
              <Link to="/clients/new" className="btn-primary">
                Criar primeiro cliente
              </Link>
            </div>
          ) : (
            <div className="recent-clients-list">
              {stats.recentClients.map((client: Client) => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="recent-client-item"
                >
                  <div className="client-info">
                    <h3>{client.name}</h3>
                    <p>{client.email}</p>
                  </div>
                  <div className="client-date">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

