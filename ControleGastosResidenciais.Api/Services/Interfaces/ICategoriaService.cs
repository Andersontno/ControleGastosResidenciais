using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de categorias
/// </summary>
public interface ICategoriaService
{
    Task<Categoria> CreateAsync(Categoria categoria);
    Task<IEnumerable<Categoria>> GetAllAsync();
    Task<Categoria?> GetByIdAsync(Guid id);
    Task<IEnumerable<object>> GetTotaisPorCategoriaAsync();
}