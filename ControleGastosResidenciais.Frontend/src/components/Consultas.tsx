import React, { useState, useEffect } from 'react';
import { Transacao, TipoTransacaoText, Pessoa, Categoria } from '../types';
import { transacaoService, pessoaService, categoriaService } from '../services';
import { useApp } from '../context/AppContext';

const Consultas: React.FC = () => {
  const { consultaFiltro, setConsultaFiltro } = useApp();

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtroTipo, setFiltroTipo] = useState<'pessoa' | 'categoria' | 'todos'>('todos');
  const [filtroId, setFiltroId] = useState<string>('');

  // Carregar dados iniciais
  const loadInitialData = async () => {
    try {
      const [pessoasData, categoriasData] = await Promise.all([
        pessoaService.getAll(),
        categoriaService.getAll()
      ]);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    }
  };

  // Aplicar filtro pré-definido se vier de outra tela
  useEffect(() => {
    if (consultaFiltro.tipo && consultaFiltro.id) {
      setFiltroTipo(consultaFiltro.tipo);
      setFiltroId(consultaFiltro.id);
      // Limpar filtro para não interferir em futuras navegações
      setConsultaFiltro({ tipo: null, id: null, nome: null });
    }
  }, [consultaFiltro, setConsultaFiltro]);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Buscar transações automaticamente quando os filtros mudarem
  useEffect(() => {
    buscarTransacoes();
  }, [filtroTipo, filtroId]);

  const buscarTransacoes = async () => {
    try {
      setLoading(true);
      setError(null);

      let transacoesData: Transacao[];

      if (filtroTipo === 'pessoa' && filtroId) {
        transacoesData = await transacaoService.getByPessoaId(filtroId);
      } else if (filtroTipo === 'categoria' && filtroId) {
        transacoesData = await transacaoService.getByCategoriaId(filtroId);
      } else if (filtroTipo === 'todos') {
        transacoesData = await transacaoService.getAll();
      } else {
        // Se não tem ID selecionado, não carregar nada
        transacoesData = [];
      }

      setTransacoes(transacoesData);
    } catch (err) {
      setError('Erro ao carregar transações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltroTipo('todos');
    setFiltroId('');
  };

  const handleFiltroTipoChange = (novoTipo: 'pessoa' | 'categoria' | 'todos') => {
    setFiltroTipo(novoTipo);
    setFiltroId(''); // Limpar ID quando tipo muda
  };

  const getNomePessoa = (pessoaId: string) => {
    const pessoa = pessoas.find(p => p.id === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  };

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.descricao : 'Categoria não encontrada';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calcularTotais = () => {
    const totalReceitas = transacoes
      .filter(t => t.tipo === 2) // Receita
      .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesas = transacoes
      .filter(t => t.tipo === 1) // Despesa
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      quantidade: transacoes.length
    };
  };

  const totais = calcularTotais();
  const filtroAtivo = consultaFiltro.nome || (
    filtroTipo === 'pessoa' && filtroId ? getNomePessoa(filtroId) :
    filtroTipo === 'categoria' && filtroId ? getNomeCategoria(filtroId) :
    filtroTipo === 'todos' ? 'Todas as transações' : ''
  );

  return (
    <div>
      <div className="card">
        <h2>Consulta de Transações</h2>

        {error && <div className="error">{error}</div>}

        {/* Filtros pré-aplicados */}
        {consultaFiltro.nome && (
          <div className="filtro-aplicado">
            <p><strong>Filtro aplicado:</strong> {consultaFiltro.nome}</p>
            <button className="button button-secondary" onClick={limparFiltros}>
              Limpar filtro
            </button>
          </div>
        )}

        {/* Controles de filtros */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="filtroTipo">Filtrar por:</label>
            <select
              id="filtroTipo"
              value={filtroTipo}
              onChange={(e) => handleFiltroTipoChange(e.target.value as any)}
            >
              <option value="todos">Todas as transações</option>
              <option value="pessoa">Pessoa</option>
              <option value="categoria">Categoria</option>
            </select>
          </div>

          {filtroTipo === 'pessoa' && (
            <div className="form-group">
              <label htmlFor="pessoaId">Pessoa:</label>
              <select
                id="pessoaId"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
              >
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filtroTipo === 'categoria' && (
            <div className="form-group">
              <label htmlFor="categoriaId">Categoria:</label>
              <select
                id="categoriaId"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(filtroTipo !== 'todos' || filtroId) && (
            <div className="form-group">
              <label>&nbsp;</label> {/* Spacer para alinhar com outros campos */}
              <button type="button" className="button button-secondary" onClick={limparFiltros}>
                Limpar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resumo dos totais */}
      {transacoes.length > 0 && (
        <div className="card">
          <h3>Resumo {filtroAtivo && `- ${filtroAtivo}`}</h3>

          <div className="totais-resumo">
            <div className="total-item">
              <span>Quantidade:</span>
              <span><strong>{totais.quantidade} transações</strong></span>
            </div>
            <div className="total-item">
              <span>Total Receitas:</span>
              <span className="text-green">{formatCurrency(totais.totalReceitas)}</span>
            </div>
            <div className="total-item">
              <span>Total Despesas:</span>
              <span className="text-red">{formatCurrency(totais.totalDespesas)}</span>
            </div>
            <div className="total-item saldo">
              <span>Saldo:</span>
              <span className={totais.saldo >= 0 ? 'text-green' : 'text-red'}>
                <strong>{formatCurrency(totais.saldo)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="card">
        <h3>Resultados da Consulta</h3>

        {loading ? (
          <div className="loading">Carregando transações...</div>
        ) : transacoes.length === 0 ? (
          <p>
            {filtroTipo !== 'todos' && !filtroId
              ? 'Selecione uma opção para visualizar as transações.'
              : 'Nenhuma transação encontrada com os filtros aplicados.'
            }
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Pessoa</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{formatDate(transacao.dataCriacao)}</td>
                  <td>{transacao.descricao}</td>
                  <td>{getNomePessoa(transacao.pessoaId)}</td>
                  <td>{getNomeCategoria(transacao.categoriaId)}</td>
                  <td>{TipoTransacaoText[transacao.tipo]}</td>
                  <td className={transacao.tipo === 1 ? 'text-red' : 'text-green'}>
                    {formatCurrency(transacao.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Consultas;