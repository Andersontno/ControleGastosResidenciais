import React, { useState } from 'react';
import './index.css';
import Pessoas from './components/Pessoas';
import Categorias from './components/Categorias';
import Transacoes from './components/Transacoes';
import Relatorios from './components/Relatorios';

type Tab = 'pessoas' | 'categorias' | 'transacoes' | 'relatorios';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pessoas');

  const renderContent = () => {
    switch (activeTab) {
      case 'pessoas':
        return <Pessoas />;
      case 'categorias':
        return <Categorias />;
      case 'transacoes':
        return <Transacoes />;
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
}

export default App;