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
        // Realiza uma busca simples para retornar todas as pessoas, ordenadas por nome
        return await _context.Pessoas
            .OrderBy(p => p.Nome)
            .ToListAsync();
    }

    public async Task<Pessoa?> GetByIdAsync(Guid id)
    {
        // Realiza uma busca simples para retornar a pessoa pelo seu ID
        return await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<object> GetTotaisPorPessoaAsync()
    {
        /*
        Geralmente prefiro deixar a responsabilidade de consultas um pouco mais complexas para o banco de dados, porém para isso
        seria necessário criar uma view, function ou procedure e configurar para rodar os scripts quando iniciar o projeto.
        Por esse motivo e o intuito do projeto, achei melhor construir a consulta usando LINQ.

        Consulta feita no SQL para me basear na construção da consulta LINQ:
        SQL Query:
            SELECT
                p."Id" as "PessoaId",
                p."Nome" as "Nome",
                p."Idade" as "Idade",
                COALESCE(SUM(CASE WHEN t."Tipo" = 2 THEN t."Valor" ELSE 0 END),0) as "TotalReceitas",
                COALESCE(SUM(CASE WHEN t."Tipo" = 1 THEN t."Valor" ELSE 0 END),0) as "TotalDespesas",
                COALESCE(SUM(CASE WHEN t."Tipo" = 2 THEN t."Valor" ELSE -t."Valor" END),0) as "SaldoLiquido",
                COUNT(t."Id") as "QuantidadeTransacoes"
            FROM "Pessoas" p
            LEFT JOIN "Transacoes" t on t."PessoaId" = p."Id"
            GROUP BY p."Id", p."Nome", p."Idade"
            ORDER BY p."Nome"
        */

        // Busca para retornar os totais por pessoa, ordenados por nome
        var totaisPorPessoa = await _context.Pessoas
            .GroupJoin(_context.Transacoes,
                p => p.Id,
                t => t.PessoaId,
                (pessoa, transacoes) => new
                {
                    PessoaId = pessoa.Id,
                    Nome = pessoa.Nome,
                    Idade = pessoa.Idade,
                    TotalReceitas = transacoes
                        .Where(t => t.Tipo == TipoTransacao.Receita)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    TotalDespesas = transacoes
                        .Where(t => t.Tipo == TipoTransacao.Despesa)
                        .Sum(t => (decimal?)t.Valor) ?? 0,
                    SaldoLiquido = transacoes
                        .Sum(t => t.Tipo == TipoTransacao.Receita ? (decimal?)t.Valor : -(decimal?)t.Valor) ?? 0,
                    QuantidadeTransacoes = transacoes.Count()
                })
            .OrderBy(p => p.Nome)
            .ToListAsync();

        // Somatório dos valores totais por pessoa para calcular os totais gerais
        var totaisGerais = new
        {
            TotalReceitas = totaisPorPessoa.Sum(p => p.TotalReceitas),
            TotalDespesas = totaisPorPessoa.Sum(p => p.TotalDespesas),
            SaldoLiquido = totaisPorPessoa.Sum(p => p.SaldoLiquido),
            TotalTransacoes = totaisPorPessoa.Sum(p => p.QuantidadeTransacoes)
        };

        // Agrupar os resultados em um objeto para retornar os totais por pessoa e os totais gerais
        var resultado = new
        {
            TotaisPorPessoa = totaisPorPessoa,
            TotaisGerais = totaisGerais
        };

        return resultado;
    }

}