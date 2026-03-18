import React, { useState, useEffect } from 'react';
import { Categoria, CreateCategoriaDto, TipoFinalidade, TipoFinalidadeText } from '../types';
import { categoriaService } from '../services';

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState<CreateCategoriaDto>({
    descricao: '',
    finalidade: TipoFinalidade.Despesa
  });

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, formData);
        setEditingCategoria(null);
      } else {
        await categoriaService.create(formData);
      }

      setFormData({ descricao: '', finalidade: TipoFinalidade.Despesa });
      await loadCategorias();
    } catch (err) {
      setError(editingCategoria ? 'Erro ao atualizar categoria' : 'Erro ao criar categoria');
      console.error(err);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      descricao: categoria.descricao,
      finalidade: categoria.finalidade
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      setError(null);
      await categoriaService.delete(id);
      await loadCategorias();
    } catch (err) {
      setError('Erro ao excluir categoria');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingCategoria(null);
    setFormData({ descricao: '', finalidade: TipoFinalidade.Despesa });
  };

  if (loading) {
    return <div className="loading">Carregando categorias...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>{editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}</h2>

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
              <label htmlFor="finalidade">Finalidade:</label>
              <select
                id="finalidade"
                value={formData.finalidade}
                onChange={(e) => setFormData({ ...formData, finalidade: parseInt(e.target.value) as TipoFinalidade })}
                required
              >
                <option value={TipoFinalidade.Despesa}>{TipoFinalidadeText[TipoFinalidade.Despesa]}</option>
                <option value={TipoFinalidade.Receita}>{TipoFinalidadeText[TipoFinalidade.Receita]}</option>
                <option value={TipoFinalidade.Ambas}>{TipoFinalidadeText[TipoFinalidade.Ambas]}</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="button button-primary">
                {editingCategoria ? 'Atualizar' : 'Criar'}
              </button>
              {editingCategoria && (
                <button type="button" className="button button-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Lista de Categorias</h2>

        {categorias.length === 0 ? (
          <p>Nenhuma categoria cadastrada.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Finalidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.descricao}</td>
                  <td>{TipoFinalidadeText[categoria.finalidade]}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="button button-secondary"
                        onClick={() => handleEdit(categoria)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(categoria.id)}
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

export default Categorias;