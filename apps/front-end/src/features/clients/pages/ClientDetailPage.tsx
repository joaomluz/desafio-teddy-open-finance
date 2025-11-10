import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/shared/lib/api';
import { Client } from '@/shared/types';
import './ClientDetailPage.css';

function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadClient(id);
    }
  }, [id]);

  const loadClient = async (clientId: string) => {
    try {
      setLoading(true);
      const response = await api.get<Client>(`/clients/${clientId}`);
      setClient(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await api.delete(`/clients/${id}`);
      navigate('/clients');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error || !client) {
    return (
      <div className="error">
        {error || 'Cliente não encontrado'}
        <Link to="/clients" className="btn-link">
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="client-detail-page">
      <div className="detail-header">
        <Link to="/clients" className="back-link">
          ← Voltar
        </Link>
        <div className="detail-actions">
          {!client.deletedAt && (
            <>
              <Link to={`/clients/${id}/edit`} className="btn-primary">
                Editar
              </Link>
              <button onClick={handleDelete} className="btn-danger">
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <h1>{client.name}</h1>
          {client.deletedAt && (
            <span className="badge-deleted">Excluído</span>
          )}
        </div>

        <div className="detail-stats">
          <div className="stat-card">
            <div className="stat-value">{client.viewCount || 0}</div>
            <div className="stat-label">Visualizações</div>
          </div>
        </div>

        <div className="detail-info">
          <div className="info-section">
            <h2>Informações Financeiras</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Salário</label>
                <p>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(client.salary || 0)}
                </p>
              </div>
              <div className="info-item">
                <label>Valor da Empresa</label>
                <p>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(client.companyValue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Auditoria</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Criado em</label>
                <p>{new Date(client.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div className="info-item">
                <label>Atualizado em</label>
                <p>{new Date(client.updatedAt).toLocaleString('pt-BR')}</p>
              </div>
              {client.deletedAt && (
                <div className="info-item">
                  <label>Excluído em</label>
                  <p>{new Date(client.deletedAt).toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailPage;

