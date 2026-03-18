using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers;

/// <summary>
/// Controller para gerenciar categorias
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    /// <summary>
    /// Criar uma nova categoria
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Categoria>> CreateCategoria(Categoria categoria)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var novaCategoria = await _categoriaService.CreateAsync(categoria);
        return CreatedAtAction(nameof(GetCategoria), new { id = novaCategoria.Id }, novaCategoria);
    }

    /// <summary>
    /// Listar todas as categorias
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
    {
        var categorias = await _categoriaService.GetAllAsync();
        return Ok(categorias);
    }

    /// <summary>
    /// Buscar uma categoria específica por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Categoria>> GetCategoria(Guid id)
    {
        var categoria = await _categoriaService.GetByIdAsync(id);

        if (categoria == null)
            return NotFound($"Categoria com ID {id} não encontrada");

        return Ok(categoria);
    }

    /// <summary>
    /// Consultar totais por categoria
    /// </summary>
    [HttpGet("totais")]
    public async Task<ActionResult<IEnumerable<object>>> GetTotaisPorCategoria()
    {
        var totais = await _categoriaService.GetTotaisPorCategoriaAsync();
        return Ok(totais);
    }
}