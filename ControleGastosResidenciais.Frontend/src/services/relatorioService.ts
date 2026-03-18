import api from './api';
import { RelatorioTotaisPessoas, RelatorioTotaisCategorias } from '../types';

export const relatorioService = {
  async getTotaisPorPessoa(): Promise<RelatorioTotaisPessoas> {
    const response = await api.get('/pessoas/totais');
    return response.data;
  },

  async getTotaisPorCategoria(): Promise<RelatorioTotaisCategorias> {
    const response = await api.get('/categorias/totais');
    return response.data;
  }
};