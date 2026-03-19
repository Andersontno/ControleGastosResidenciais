import React, { useState, useEffect } from 'react';
import { Pessoa, CreatePessoaDto } from '../types';
import { pessoaService } from '../services';
import { useApp } from '../context/AppContext';

const Pessoas: React.FC = () => {
  const { setActiveTab, setConsultaFiltro } = useApp();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [formData, setFormData] = useState<CreatePessoaDto>({
    nome: '',
    idade: 0
  });

  const loadPessoas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pessoaService.getAll();
      setPessoas(data);
    } catch (err) {
      setError('Erro ao carregar pessoas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPessoas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      if (editingPessoa) {
        await pessoaService.update(editingPessoa.id, formData);
        setEditingPessoa(null);
      } else {
        await pessoaService.create(formData);
      }

      setFormData({ nome: '', idade: 0 });
      await loadPessoas();
    } catch (err) {
      setError(editingPessoa ? 'Erro ao atualizar pessoa' : 'Erro ao criar pessoa');
      console.error(err);
    }
  };

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa);
    setFormData({
      nome: pessoa.nome,
      idade: pessoa.idade
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }

    try {
      setError(null);
      await pessoaService.delete(id);
      await loadPessoas();
    } catch (err) {
      setError('Erro ao excluir pessoa');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingPessoa(null);
    setFormData({ nome: '', idade: 0 });
  };

  const abrirConsultasPessoa = (pessoa: Pessoa) => {
  setConsultaFiltro({
    tipo: 'pessoa',
    id: pessoa.id,
    nome: `Transações de ${pessoa.nome}`
  });
  setActiveTab('consultas');
  };

  if (loading) {
    return <div className="loading">Carregando pessoas...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>{editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="idade">Idade:</label>
              <input
                type="number"
                id="idade"
                value={formData.idade}
                onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                required
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="button button-primary">
                {editingPessoa ? 'Atualizar' : 'Criar'}
              </button>
              {editingPessoa && (
                <button type="button" className="button button-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Lista de Pessoas</h2>

        {pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.idade}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="button button-secondary"
                        onClick={() => handleEdit(pessoa)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(pessoa.id)}
                      >
                        Excluir
                      </button>
                      <button
                        className="button button-primary"
                        onClick={() => abrirConsultasPessoa(pessoa)}
                      >
                        Transações
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

export default Pessoas;