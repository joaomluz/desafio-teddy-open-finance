import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelectedClients } from '../context/SelectedClientsContext';
import api from '@/shared/lib/api';
import { Client } from '@/shared/types';
import './SelectedClientsPage.css';

function SelectedClientsPage() {
  const { selectedClients, removeClient, clearAll } = useSelectedClients();
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Memoizar string de IDs para comparação
  const selectedIdsString = useMemo(
    () => selectedClients.map((c) => c.id).sort().join(','),
    [selectedClients]
  );

  // Carregar dados completos dos clientes selecionados
  useEffect(() => {
    let isCancelled = false;

    const loadClientsData = async () => {
      if (selectedClients.length === 0) {
        if (!isCancelled) {
          setClientsData([]);
          setLoading(false);
        }
        return;
      }

      try {
        if (!isCancelled) {
          setLoading(true);
        }
        
        // Carregar dados atualizados dos clientes
        const clientsPromises = selectedClients.map((client) =>
          api.get<Client>(`/clients/${client.id}`).then((res) => res.data).catch(() => null)
        );
        const loadedClients = await Promise.all(clientsPromises);
        
        // Filtrar apenas clientes que ainda existem e não foram deletados
        const activeClients = loadedClients.filter(
          (client): client is Client => client !== null && !client.deletedAt
        );
        
        if (!isCancelled) {
          setClientsData(activeClients);
          setLoading(false);
        }
        
        // Nota: Não removemos clientes inválidos automaticamente aqui para evitar loops
        // Isso será tratado quando o usuário tentar visualizar ou interagir com eles
      } catch (error) {
        console.error('Erro ao carregar clientes selecionados:', error);
        if (!isCancelled) {
          // Se houver erro, usar os dados que já temos
          const fallbackClients = selectedClients.filter((client) => !client.deletedAt);
          setClientsData(fallbackClients);
          setLoading(false);
        }
      }
    };

    loadClientsData();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdsString]); // Usar apenas a string de IDs para evitar loops

  const handleRemoveClient = (clientId: string) => {
    setRemovingId(clientId);
    // Aguardar animação antes de remover
    setTimeout(() => {
      removeClient(clientId);
      setRemovingId(null);
    }, 300);
  };

  const handleClearAll = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearAll = () => {
    clearAll();
    setShowConfirmDialog(false);
  };

  const cancelClearAll = () => {
    setShowConfirmDialog(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="selected-clients-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando clientes selecionados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="selected-clients-page">
      <h2 className="section-title">Clientes selecionados:</h2>

      {clientsData.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum cliente selecionado.</p>
          <p className="empty-state-subtitle">
            Vá para a página de <Link to="/clients">Clientes</Link> para adicionar clientes à lista.
          </p>
        </div>
      ) : (
        <>
          <section className="selected-clients-grid">
            {clientsData.map((client, index) => (
              <article
                key={client.id}
                className={`selected-client-card ${removingId === client.id ? 'removing' : ''}`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <h3 className="client-name">{client.name}</h3>
                <div className="client-details">
                  <p className="client-salary">
                    Salário: {formatCurrency(client.salary || 0)}
                  </p>
                  <p className="client-company">
                    Empresa: {formatCurrency(client.companyValue || 0)}
                  </p>
                </div>
                <button
                  className="remove-client-btn"
                  onClick={() => handleRemoveClient(client.id)}
                  title="Remover cliente"
                  aria-label="Remover cliente dos selecionados"
                >
                  −
                </button>
              </article>
            ))}
          </section>

          <div className="clear-clients-container">
            <button
              className="clear-clients-btn"
              onClick={handleClearAll}
              disabled={clientsData.length === 0}
            >
              Limpar clientes selecionados
            </button>
          </div>
        </>
      )}

      {/* Dialog de confirmação */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay" onClick={cancelClearAll}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog-title">Confirmar ação</h3>
            <p className="confirm-dialog-message">
              Deseja realmente limpar todos os clientes selecionados?
            </p>
            <div className="confirm-dialog-actions">
              <button
                className="confirm-dialog-btn confirm-dialog-btn-cancel"
                onClick={cancelClearAll}
              >
                Cancelar
              </button>
              <button
                className="confirm-dialog-btn confirm-dialog-btn-confirm"
                onClick={confirmClearAll}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectedClientsPage;

