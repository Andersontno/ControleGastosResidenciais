using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de transações
/// </summary>
public interface ITransacaoService
{
    Task<Transacao> CreateAsync(Transacao transacao);
    Task<IEnumerable<Transacao>> GetAllAsync();
    Task<Transacao?> GetByIdAsync(Guid id);
    Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId);
}