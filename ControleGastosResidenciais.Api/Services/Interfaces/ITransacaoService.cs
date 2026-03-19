using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de transações
/// </summary>
public interface ITransacaoService
{
    /// <summary>
    /// Cria uma nova transação no sistema.
    /// </summary>
    /// <param name="transacao">Objeto transação contendo os dados da receita ou despesa a ser registrada</param>
    /// <returns>Objeto de transação criado</returns>
    Task<Transacao> CreateAsync(Transacao transacao);

    /// <summary>
    /// Recupera todas as transações cadastradas no sistema.
    /// </summary>
    /// <returns>Uma coleção contendo todas as transações</returns>
    Task<IEnumerable<Transacao>> GetAllAsync();

    /// <summary>
    /// Busca uma transação específica pelo seu identificador único.
    /// </summary>
    /// <param name="id">Identificador único da transação</param>
    /// <returns>A transação encontrada ou null se não existir</returns>
    Task<Transacao?> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera todas as transações associadas a uma pessoa específica.
    /// </summary>
    /// <param name="pessoaId">Identificador único da pessoa</param>
    /// <returns>Uma coleção contendo todas as transações da pessoa</returns>
    Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId);

    /// <summary>
    /// Recupera todas as transações associadas a uma categoria específica.
    /// </summary>
    /// <param name="categoriaId">Identificador único da categoria</param>
    /// <returns>Uma coleção contendo todas as transações da categoria</returns>
    Task<IEnumerable<Transacao>> GetByCategoriaIdAsync(Guid categoriaId);
}