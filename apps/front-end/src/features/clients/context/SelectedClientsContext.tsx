import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '@/shared/types';

interface SelectedClientsContextType {
  selectedClients: Client[];
  addClient: (client: Client) => void;
  removeClient: (clientId: string) => void;
  clearAll: () => void;
  isSelected: (clientId: string) => boolean;
  toggleClient: (client: Client) => void;
}

const SelectedClientsContext = createContext<SelectedClientsContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedClients';

export function SelectedClientsProvider({ children }: { children: ReactNode }) {
  const [selectedClients, setSelectedClients] = useState<Client[]>(() => {
    // Carregar do localStorage ao inicializar
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes selecionados:', error);
    }
    return [];
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedClients));
    } catch (error) {
      console.error('Erro ao salvar clientes selecionados:', error);
    }
  }, [selectedClients]);

  const addClient = (client: Client) => {
    setSelectedClients((prev) => {
      // Verificar se o cliente já existe
      if (prev.some((c) => c.id === client.id)) {
        return prev;
      }
      return [...prev, client];
    });
  };

  const removeClient = (clientId: string) => {
    setSelectedClients((prev) => prev.filter((client) => client.id !== clientId));
  };

  const clearAll = () => {
    setSelectedClients([]);
  };

  const isSelected = (clientId: string) => {
    return selectedClients.some((client) => client.id === clientId);
  };

  const toggleClient = (client: Client) => {
    if (isSelected(client.id)) {
      removeClient(client.id);
    } else {
      addClient(client);
    }
  };

  return (
    <SelectedClientsContext.Provider
      value={{
        selectedClients,
        addClient,
        removeClient,
        clearAll,
        isSelected,
        toggleClient,
      }}
    >
      {children}
    </SelectedClientsContext.Provider>
  );
}

export function useSelectedClients() {
  const context = useContext(SelectedClientsContext);
  if (context === undefined) {
    throw new Error('useSelectedClients must be used within a SelectedClientsProvider');
  }
  return context;
}

