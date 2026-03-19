import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  consultaFiltro: {
    tipo: 'pessoa' | 'categoria' | null;
    id: string | null;
    nome: string | null;
  };
  setConsultaFiltro: (filtro: { tipo: 'pessoa' | 'categoria' | null; id: string | null; nome: string | null }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('pessoas');
  const [consultaFiltro, setConsultaFiltro] = useState({
    tipo: null as 'pessoa' | 'categoria' | null,
    id: null as string | null,
    nome: null as string | null
  });

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      consultaFiltro,
      setConsultaFiltro
    }}>
      {children}
    </AppContext.Provider>
  );
};