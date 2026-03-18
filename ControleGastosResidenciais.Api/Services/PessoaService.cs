using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.Services;

/// <summary>
/// Implementação do serviço de pessoas
/// </summary>
public class PessoaService : IPessoaService
{
    private readonly ControleGastosContext _context;

    public PessoaService(ControleGastosContext context)
    {
        _context = context;
    }

    public async Task<Pessoa> CreateAsync(Pessoa pessoa)
    {

        // Validar nome não vazio
        if (string.IsNullOrWhiteSpace(pessoa.Nome))
        {
            throw new ArgumentException("Nome não pode ser vazio");
        }

        // Validar quantidade de caracteres do nome
        if (pessoa.Nome.Length > 200)
        {
            throw new ArgumentException("Nome não pode ter mais de 200 caracteres");
        }

        // Validar idade maior que zero
        if (pessoa.Idade <= 0)
        {
            throw new ArgumentException("Idade não pode ser negativa");
        }


        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return pessoa;
    }

    public async Task<Pessoa?> UpdateAsync(Guid id, Pessoa pessoa)
    {
        // Validar nome não vazio
        if (string.IsNullOrWhiteSpace(pessoa.Nome))
        {
            throw new ArgumentException("Nome não pode ser vazio");
        }

        // Validar quantidade de caracteres do nome
        if (pessoa.Nome.Length > 200)
        {
            throw new ArgumentException("Nome não pode ter mais de 200 caracteres");
        }

        // Validar idade maior que zero
        if (pessoa.Idade <= 0)
        {
            throw new ArgumentException("Idade não pode ser negativa");
        }

        var existingPessoa = await _context.Pessoas.FindAsync(id);
        if (existingPessoa == null)
            return null;

        existingPessoa.Nome = pessoa.Nome;
        existingPessoa.Idade = pessoa.Idade;

        await _context.SaveChangesAsync();
        return existingPessoa;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null)
            return false;

        // Todas as transações serão deletadas pelo cascade configurado no contexto
        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Pessoa>> GetAllAsync()
    {
        return await _context.Pessoas
            .OrderBy(p => p.Nome)
            .ToListAsync();
    }

    public async Task<Pessoa?> GetByIdAsync(Guid id)
    {
        return await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<object>> GetTotaisPorPessoaAsync()
    {
        throw new NotImplementedException();
    }

}