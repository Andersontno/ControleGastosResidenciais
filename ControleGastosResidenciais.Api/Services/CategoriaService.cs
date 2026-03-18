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

    public async Task<IEnumerable<object>> GetTotaisPorCategoriaAsync()
    {
        throw new NotImplementedException();
    }
}