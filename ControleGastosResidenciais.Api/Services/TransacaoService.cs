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
        // Validar descrição não vazia
        if (string.IsNullOrWhiteSpace(transacao.Descricao))
        {
            throw new ArgumentException("Descrição não pode ser vazia");
        }

        // Validar quantidade de caracteres da descrição
        if (transacao.Descricao.Length > 400)
        {
            throw new ArgumentException("Descrição não pode ter mais de 400 caracteres");
        }

        //Validar tipo de transação
        if (!Enum.IsDefined(typeof(TipoTransacao), transacao.Tipo))
        {
            throw new ArgumentException("Tipo de transação inválido");
        }

        // Validar se pessoa existe
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null)
        {
            throw new ArgumentException("Pessoa não encontrada");
        }

        // Validar se categoria existe
        var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
        if (categoria == null)
        {
            throw new ArgumentException("Categoria não encontrada");
        }

        // Validar tipo de transação para menores de 18 anos
        if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
        {
            throw new InvalidOperationException("Menores de 18 anos só podem registrar despesas");
        }

        // Validar compatibilidade entre tipo da transação e finalidade da categoria
        if (categoria.Finalidade != TipoFinalidade.Ambas &&
            ((transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade != TipoFinalidade.Despesa) ||
             (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade != TipoFinalidade.Receita)))
        {
            throw new InvalidOperationException("Tipo de transação incompatível com a finalidade da categoria");
        }

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