import api from './api';
import { Categoria, CreateCategoriaDto } from '../types';

export const categoriaService = {
  async getAll(): Promise<Categoria[]> {
    const response = await api.get('/categorias');
    return response.data;
  },

  async getById(id: string): Promise<Categoria> {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  async create(categoria: CreateCategoriaDto): Promise<Categoria> {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },

  async update(id: string, categoria: CreateCategoriaDto): Promise<Categoria> {
    const response = await api.put(`/categorias/${id}`, categoria);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categorias/${id}`);
  },

  async getTotaisPorCategoria(): Promise<any[]> {
    const response = await api.get('/categorias/totais');
    return response.data;
  }
};