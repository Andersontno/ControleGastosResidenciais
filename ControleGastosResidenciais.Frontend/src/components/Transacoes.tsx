import React, { useState, useEffect } from 'react';
import { Transacao, CreateTransacaoDto, TipoTransacao, TipoTransacaoText, Categoria, Pessoa } from '../types';
import { transacaoService, categoriaService, pessoaService } from '../services';

const Transacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);
  const [formData, setFormData] = useState<CreateTransacaoDto>({
    descricao: '',
    valor: 0,
    tipo: TipoTransacao.Despesa,
    categoriaId: '',
    pessoaId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
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
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoriaId || !formData.pessoaId) {
      setError('Por favor, selecione uma categoria e uma pessoa');
      return;
    }

    try {
      setError(null);
      if (editingTransacao) {
        await transacaoService.update(editingTransacao.id, formData);
        setEditingTransacao(null);
      } else {
        await transacaoService.create(formData);
      }

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
      setError(editingTransacao ? 'Erro ao atualizar transação' : 'Erro ao criar transação');
      console.error(err);
    }
  };

  const handleEdit = (transacao: Transacao) => {
    setEditingTransacao(transacao);
    setFormData({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoriaId: transacao.categoriaId,
      pessoaId: transacao.pessoaId
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      setError(null);
      await transacaoService.delete(id);
      const transacoesData = await transacaoService.getAll();
      setTransacoes(transacoesData);
    } catch (err) {
      setError('Erro ao excluir transação');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingTransacao(null);
    setFormData({
      descricao: '',
      valor: 0,
      tipo: TipoTransacao.Despesa,
      categoriaId: '',
      pessoaId: ''
    });
  };

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.descricao : 'Categoria não encontrada';
  };

  const getNomePessoa = (pessoaId: string) => {
    const pessoa = pessoas.find(p => p.id === pessoaId);
    return pessoa ? pessoa.nome : 'Pessoa não encontrada';
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

  if (loading) {
    return <div className="loading">Carregando transações...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>{editingTransacao ? 'Editar Transação' : 'Nova Transação'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              {editingTransacao ? 'Atualizar' : 'Criar'}
            </button>
            {editingTransacao && (
              <button type="button" className="button button-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
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
                <th>Ações</th>
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
                  <td>
                    <div className="actions">
                      <button
                        className="button button-secondary"
                        onClick={() => handleEdit(transacao)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(transacao.id)}
                      >
                        Excluir
                      </button>
                    </div>
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

export default Transacoes;