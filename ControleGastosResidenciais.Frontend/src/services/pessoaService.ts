import api from './api';
import { Pessoa, CreatePessoaDto } from '../types';

export const pessoaService = {
  async getAll(): Promise<Pessoa[]> {
    const response = await api.get('/pessoas');
    return response.data;
  },

  async getById(id: string): Promise<Pessoa> {
    const response = await api.get(`/pessoas/${id}`);
    return response.data;
  },

  async create(pessoa: CreatePessoaDto): Promise<Pessoa> {
    const response = await api.post('/pessoas', pessoa);
    return response.data;
  },

  async update(id: string, pessoa: CreatePessoaDto): Promise<Pessoa> {
    const response = await api.put(`/pessoas/${id}`, pessoa);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pessoas/${id}`);
  }
};