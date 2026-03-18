using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de pessoas
/// </summary>
public interface IPessoaService
{
    Task<Pessoa> CreateAsync(Pessoa pessoa);
    Task<Pessoa?> UpdateAsync(Guid id, Pessoa pessoa);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<Pessoa>> GetAllAsync();
    Task<Pessoa?> GetByIdAsync(Guid id);
    Task<IEnumerable<object>> GetTotaisPorPessoaAsync();
}