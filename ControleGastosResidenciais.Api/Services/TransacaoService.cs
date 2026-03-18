using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.Services;

/// <summary>
/// Implementação do serviço de transações
/// </summary>
public class TransacaoService : ITransacaoService
{
    private readonly ControleGastosContext _context;

    public TransacaoService(ControleGastosContext context)
    {
        _context = context;
    }

    public async Task<Transacao> CreateAsync(Transacao transacao)
    {
        // Validar se pessoa existe
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null)
            throw new ArgumentException("Pessoa não encontrada");

        // Validar se categoria existe
        var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
        if (categoria == null)
            throw new ArgumentException("Categoria não encontrada");

        // Menores de 18 anos só podem fazer despesas
        if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            throw new InvalidOperationException("Menores de 18 anos só podem registrar despesas");

        //TODO Validar compatibilidade entre tipo da transação e finalidade da categoria

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        // Reload para incluir as navigation properties
        return await GetByIdAsync(transacao.Id) ?? transacao;
    }

    public async Task<IEnumerable<Transacao>> GetAllAsync()
    {
        return await _context.Transacoes
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();
    }

    public async Task<Transacao?> GetByIdAsync(Guid id)
    {
        return await _context.Transacoes.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Transacao>> GetByPessoaIdAsync(Guid pessoaId)
    {
        return await _context.Transacoes
            .Where(t => t.PessoaId == pessoaId)
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();
    }

}