using ControleGastosResidenciais.Api.Data;
using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.Services;

/// <summary>
/// Implementação do serviço de categorias
/// </summary>
public class CategoriaService : ICategoriaService
{
    private readonly ControleGastosContext _context;

    public CategoriaService(ControleGastosContext context)
    {
        _context = context;
    }

    public async Task<Categoria> CreateAsync(Categoria categoria)
    {
        //Validar finalidade da categoria
        if (!Enum.IsDefined(typeof(TipoFinalidade), categoria.Finalidade))
        {
            throw new ArgumentException("Finalidade da categoria inválida");
        }

        // Validar descrição não vazia
        if (string.IsNullOrWhiteSpace(categoria.Descricao))
        {
            throw new ArgumentException("Descrição não pode ser vazia");
        }

        // Validar quantidade de caracteres da descrição
        if (categoria.Descricao.Length > 400)
        {
            throw new ArgumentException("Descrição não pode ter mais de 400 caracteres");
        }

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();
        return categoria;
    }

    public async Task<IEnumerable<Categoria>> GetAllAsync()
    {
        return await _context.Categorias
            .OrderBy(c => c.Descricao)
            .ToListAsync();
    }

    public async Task<Categoria?> GetByIdAsync(Guid id)
    {
        return await _context.Categorias.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<object> GetTotaisPorCategoriaAsync()
    {
        /*
         SQL Query:
            SELECT
                c."Id" as "CategoriaId",
                c."Descricao" as "Descricao",
                COALESCE(SUM(CASE WHEN t."Tipo" = 2 THEN t."Valor" ELSE 0 END),0) as "TotalReceitas",
                COALESCE(SUM(CASE WHEN t."Tipo" = 1 THEN t."Valor" ELSE 0 END),0) as "TotalDespesas",
                COALESCE(SUM(CASE WHEN t."Tipo" = 2 THEN t."Valor" ELSE -t."Valor" END),0) as "SaldoLiquido",
                COUNT(t."Id") as "QuantidadeTransacoes"
            FROM "Categorias" c
            LEFT JOIN "Transacoes" t on t."CategoriaId" = c."Id"
            GROUP BY c."Id", c."Descricao"
            ORDER BY c."Descricao"
        */
        var totaisPorCategoria = await _context.Categorias
            .GroupJoin(_context.Transacoes,
                c => c.Id,
                t => t.CategoriaId,
                (categoria, transacoes) => new
                {
                    CategoriaId = categoria.Id,
                    Descricao = categoria.Descricao,
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
            .OrderBy(c => c.Descricao)
            .ToListAsync();

        // Calcular totais gerais
        var totaisGerais = new
        {
            TotalReceitas = totaisPorCategoria.Sum(c => c.TotalReceitas),
            TotalDespesas = totaisPorCategoria.Sum(c => c.TotalDespesas),
            SaldoLiquido = totaisPorCategoria.Sum(c => c.SaldoLiquido),
            TotalTransacoes = totaisPorCategoria.Sum(c => c.QuantidadeTransacoes)
        };

        var resultado = new
        {
            TotaisGerais = totaisGerais,
            DetalhesPorCategoria = totaisPorCategoria
        };

        return resultado;
    }
}