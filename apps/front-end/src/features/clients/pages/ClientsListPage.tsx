import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/shared/lib/api';
import { Client } from '@/shared/types';
import { useSelectedClients } from '../context/SelectedClientsContext';
import EditIcon from '@/shared/components/EditIcon';
import DeleteIcon from '@/shared/components/DeleteIcon';
import CreateClientModal from '../components/CreateClientModal';
import './ClientsListPage.css';

function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(16);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toggleClient, isSelected } = useSelectedClients();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await api.get<Client[]>('/clients');
      // Filtrar apenas clientes ativos (não excluídos)
      const activeClients = response.data.filter(client => !client.deletedAt);
      setClients(activeClients);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await api.delete(`/clients/${id}`);
      loadClients();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  const handleAddToSelected = (client: Client) => {
    toggleClient(client);
  };

  const handleEdit = (id: string) => {
    navigate(`/clients/${id}/edit`);
  };

  // Paginação
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;
  const paginatedClients = clients.slice(startIndex, endIndex);

  // Formatar valores monetários (simulado - você pode ajustar baseado nos dados reais)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Obter salário e empresa do cliente
  const getClientSalary = (client: Client) => {
    return client.salary || 0;
  };

  const getClientCompany = (client: Client) => {
    return client.companyValue || 0;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="clients-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-list-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadClients} className="btn-retry">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="clients-list-page">
      {/* Header com contador e filtro */}
      <div className="clients-header">
        <div className="clients-count">
          <strong>{clients.length}</strong> clientes encontrados:
        </div>
        <div className="clients-per-page-selector">
          <label htmlFor="clients-per-page">Clientes por página:</label>
          <select
            id="clients-per-page"
            value={clientsPerPage}
            onChange={(e) => {
              setClientsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="clients-per-page-select"
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
            <option value={32}>32</option>
          </select>
        </div>
      </div>

      {/* Grid de clientes */}
      {paginatedClients.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum cliente encontrado</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-create-client"
          >
            Criar cliente
          </button>
        </div>
      ) : (
        <>
          <div className="clients-grid">
            {paginatedClients.map((client) => (
              <div key={client.id} className="client-card">
                <h3 className="client-name">{client.name}</h3>
                <div className="client-info">
                  <p className="client-salary">
                    Salário: {formatCurrency(getClientSalary(client))}
                  </p>
                  <p className="client-company">
                    Empresa: {formatCurrency(getClientCompany(client))}
                  </p>
                </div>
                <div className="client-actions">
                  <button
                    className={`action-btn add-btn ${isSelected(client.id) ? 'selected' : ''}`}
                    onClick={() => handleAddToSelected(client)}
                    title={isSelected(client.id) ? 'Remover dos selecionados' : 'Adicionar aos selecionados'}
                    aria-label={isSelected(client.id) ? 'Remover cliente dos selecionados' : 'Adicionar cliente aos selecionados'}
                  >
                    <span className={isSelected(client.id) ? 'active' : ''}>+</span>
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(client.id)}
                    title="Editar cliente"
                    aria-label="Editar cliente"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(client.id)}
                    title="Excluir cliente"
                    aria-label="Excluir cliente"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Criar Cliente */}
          <div className="create-client-container">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-create-client-full"
            >
              Criar cliente
            </button>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Paginação">
              {renderPagination()}
            </nav>
          )}
        </>
      )}

      {/* Modal de Criar Cliente */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadClients();
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default ClientsListPage;
