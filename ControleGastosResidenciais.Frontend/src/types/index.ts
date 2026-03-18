export enum TipoTransacao {
  Despesa = 1,
  Receita = 2
}

export enum TipoFinalidade {
  Despesa = 1,
  Receita = 2,
  Ambas = 3
}

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: TipoFinalidade;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
  dataCriacao: string;
}

export interface CreatePessoaDto {
  nome: string;
  idade: number;
}

export interface CreateCategoriaDto {
  descricao: string;
  finalidade: TipoFinalidade;
}

export interface CreateTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
}

// Helper para converter enum para texto
export const TipoTransacaoText = {
  [TipoTransacao.Despesa]: 'Despesa',
  [TipoTransacao.Receita]: 'Receita'
};

export const TipoFinalidadeText = {
  [TipoFinalidade.Despesa]: 'Despesa',
  [TipoFinalidade.Receita]: 'Receita',
  [TipoFinalidade.Ambas]: 'Ambas'
};