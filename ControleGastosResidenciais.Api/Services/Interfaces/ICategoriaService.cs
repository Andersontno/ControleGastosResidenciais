using ControleGastosResidenciais.Api.Models;

namespace ControleGastosResidenciais.Api.Services.Interfaces;

/// <summary>
/// Interface para o serviço de categorias
/// </summary>
public interface ICategoriaService
{
    /// <summary>
    /// Cria uma nova categoria no sistema.
    /// </summary>
    /// <param name="categoria">Objeto categoria contendo os dados da categoria a ser registrada</param>
    /// <returns>Objeto de categoria criado</returns>
    Task<Categoria> CreateAsync(Categoria categoria);

    /// <summary>
    /// Recupera todas as categorias cadastradas no sistema.
    /// </summary>
    /// <returns>Uma coleção contendo todas as categorias</returns>
    Task<IEnumerable<Categoria>> GetAllAsync();

    /// <summary>
    /// Busca uma categoria específica pelo seu identificador único.
    /// </summary>
    /// <param name="id">Identificador único da categoria</param>
    /// <returns>A categoria encontrada ou null se não existir</returns>
    Task<Categoria?> GetByIdAsync(Guid id);

    /// <summary>
    /// Recupera os totais por categoria.
    /// </summary>
    /// <returns>Uma coleção contendo os totais por categoria</returns>
    Task<object> GetTotaisPorCategoriaAsync();
}