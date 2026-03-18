using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de pessoas
/// </summary>
public interface IPessoaService
{
    /// <summary>
    /// Cria uma nova pessoa no sistema.
    /// </summary>
    /// <param name="pessoa">Objeto pessoa contendo os dados da pessoa a ser registrada</param>
    /// <returns>Objeto de pessoa criado</returns>
    Task<Pessoa> CreateAsync(Pessoa pessoa);

    /// <summary>
    /// Atualiza os dados de uma pessoa existente no sistema.
    /// </summary>
    /// <param name="id">Identificador único da pessoa</param>
    /// <param name="pessoa">Objeto pessoa contendo os dados atualizados</param>
    /// <returns>Objeto de pessoa atualizado ou null se não existir</returns>
    Task<Pessoa?> UpdateAsync(Guid id, Pessoa pessoa);

    /// <summary>
    /// Remove uma pessoa do sistema.
    /// </summary>
    /// <param name="id">Identificador único da pessoa</param>
    /// <returns>True se a pessoa foi removida com sucesso, caso contrário, false</returns>
    Task<bool> DeleteAsync(Guid id);

    /// <summary>
    /// Recupera todas as pessoas cadastradas no sistema.
    /// </summary>
    /// <returns>Uma coleção contendo todas as pessoas</returns>
    Task<IEnumerable<Pessoa>> GetAllAsync();

    /// <summary>
    /// Busca uma pessoa específica pelo seu identificador único.
    /// </summary>
    /// <param name="id">Identificador único da pessoa</param>
    /// <returns>A pessoa encontrada ou null se não existir</returns>
    Task<Pessoa?> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera os totais por pessoa.
    /// </summary>
    /// <returns>Uma coleção contendo os totais por pessoa</returns>
    Task<object> GetTotaisPorPessoaAsync();
}