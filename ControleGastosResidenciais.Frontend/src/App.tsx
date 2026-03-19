import React from 'react';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import Pessoas from './components/Pessoas';
import Categorias from './components/Categorias';
import Transacoes from './components/Transacoes';
import Relatorios from './components/Relatorios';
import Consultas from './components/Consultas';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'pessoas':
        return <Pessoas />;
      case 'categorias':
        return <Categorias />;
      case 'transacoes':
        return <Transacoes />;
      case 'consultas':
        return <Consultas />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Pessoas />;
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Controle de Gastos Residenciais</h1>
      </div>

      <div className="container">
        <nav className="navigation">
          <button
            className={`nav-button ${activeTab === 'pessoas' ? 'active' : ''}`}
            onClick={() => setActiveTab('pessoas')}
          >
            Pessoas
          </button>
          <button
            className={`nav-button ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            Categorias
          </button>
          <button
            className={`nav-button ${activeTab === 'transacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('transacoes')}
          >
            Transações
          </button>
          <button
            className={`nav-button ${activeTab === 'consultas' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultas')}
          >
            Consultas
          </button>
          <button
            className={`nav-button ${activeTab === 'relatorios' ? 'active' : ''}`}
            onClick={() => setActiveTab('relatorios')}
          >
            Relatórios
          </button>
        </nav>

        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;