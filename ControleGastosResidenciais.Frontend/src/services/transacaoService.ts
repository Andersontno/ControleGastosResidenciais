import api from './api';
import { Transacao, CreateTransacaoDto } from '../types';

export const transacaoService = {
  async getAll(): Promise<Transacao[]> {
    const response = await api.get('/transacoes');
    return response.data;
  },

  async getById(id: string): Promise<Transacao> {
    const response = await api.get(`/transacoes/${id}`);
    return response.data;
  },

  async create(transacao: CreateTransacaoDto): Promise<Transacao> {
    const response = await api.post('/transacoes', transacao);
    return response.data;
  },

  async getByPessoaId(pessoaId: string): Promise<Transacao[]> {
    const response = await api.get(`/transacoes/pessoa/${pessoaId}`);
    return response.data;
  },

  async getByCategoriaId(categoriaId: string): Promise<Transacao[]> {
    const response = await api.get(`/transacoes/categoria/${categoriaId}`);
    return response.data;
  },
};