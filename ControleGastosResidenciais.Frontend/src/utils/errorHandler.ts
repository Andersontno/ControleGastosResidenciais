import { AxiosError } from 'axios';

export const getErrorMessage = (error: any): string => {
  // Se for um erro do Axios (resposta da API)
  if (error.response) {
    const { data, status } = error.response;

    // Tentar extrair a mensagem do erro
    if (typeof data === 'string') {
      return data;
    }

    // Se for um objeto, pode ter diferentes estruturas
    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      // Para erros de validação do ModelState
      if (Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }

      // Para erros de validação com propriedades
      if (typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat().join(', ');
        return errorMessages;
      }

      return data.errors.toString();
    }

    // Tentar extrair de outras propriedades comuns
    if (data?.error) {
      return data.error;
    }

    if (data?.title) {
      return data.title;
    }

    // Se não conseguir extrair, usar o status
    return `Erro ${status}: ${data}`;
  }

  // Se for erro de rede
  if (error.request) {
    return 'Erro de conexão. Verifique sua conexão com a internet.';
  }

  // Outros erros
  return error.message || 'Erro desconhecido';
};