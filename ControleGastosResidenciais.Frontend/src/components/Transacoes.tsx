import React, { useState, useEffect } from 'react';
import { transacaoService } from '../services/transacaoService';
import { categoriaService } from '../services/categoriaService';
import { pessoaService } from '../services/pessoaService';
import { Transacao, Categoria, Pessoa, TipoTransacao, TipoTransacaoText, CreateTransacaoDto } from '../types';
import { getErrorMessage } from '../utils/errorHandler';

const Transacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTransacaoDto>({
    descricao: '',
    valor: 0,
    tipo: TipoTransacao.Despesa,
    categoriaId: '',
    pessoaId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);

      const [transacoesData, categoriasData, pessoasData] = await Promise.all([
        transacaoService.getAll(),
        categoriaService.getAll(),
        pessoaService.getAll()
      ]);

      setTransacoes(transacoesData);
      setCategorias(categoriasData);
      setPessoas(pessoasData);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoriaId || !formData.pessoaId) {
      setError('Por favor, selecione uma categoria e uma pessoa');
      return;
    }

    try {
      setError(null);
      await transacaoService.create(formData);

      setFormData({
        descricao: '',
        valor: 0,
        tipo: TipoTransacao.Despesa,
        categoriaId: '',
        pessoaId: ''
      });

      const transacoesData = await transacaoService.getAll();
      setTransacoes(transacoesData);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  const getNomeCategoria = (categoriaId: string): string => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.descricao : 'Categoria não encontrada';
  };

  const getNomePessoa = (pessoaId: string): string => {
    const pessoa = pessoas.find(p => p.id === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="page">
      <h1>Transações</h1>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Nova Transação</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <input
                type="text"
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor:</label>
              <input
                type="number"
                id="valor"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo:</label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: parseInt(e.target.value) as TipoTransacao })}
                required
              >
                <option value={TipoTransacao.Despesa}>{TipoTransacaoText[TipoTransacao.Despesa]}</option>
                <option value={TipoTransacao.Receita}>{TipoTransacaoText[TipoTransacao.Receita]}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoriaId">Categoria:</label>
              <select
                id="categoriaId"
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pessoaId">Pessoa:</label>
              <select
                id="pessoaId"
                value={formData.pessoaId}
                onChange={(e) => setFormData({ ...formData, pessoaId: e.target.value })}
                required
              >
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="button button-primary">
              Criar
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Lista de Transações</h2>

        {transacoes.length === 0 ? (
          <p>Nenhuma transação cadastrada.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Pessoa</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{transacao.descricao}</td>
                  <td className={transacao.tipo === TipoTransacao.Despesa ? 'text-red' : 'text-green'}>
                    {formatCurrency(transacao.valor)}
                  </td>
                  <td>{TipoTransacaoText[transacao.tipo]}</td>
                  <td>{getNomeCategoria(transacao.categoriaId)}</td>
                  <td>{getNomePessoa(transacao.pessoaId)}</td>
                  <td>{formatDate(transacao.dataCriacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transacoes;