using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers;

/// <summary>
/// Controller para gerenciar pessoas
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Criar uma nova pessoa
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Pessoa>> CreatePessoa(Pessoa pessoa)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var novaPessoa = await _pessoaService.CreateAsync(pessoa);
        return CreatedAtAction(nameof(GetPessoa), new { id = novaPessoa.Id }, novaPessoa);
    }

    /// <summary>
    /// Atualizar uma pessoa existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePessoa(Guid id, Pessoa pessoa)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pessoaAtualizada = await _pessoaService.UpdateAsync(id, pessoa);

        if (pessoaAtualizada == null)
            return NotFound($"Pessoa com ID {id} não encontrada");

        return Ok(pessoaAtualizada);
    }

    /// <summary>
    /// Excluir uma pessoa
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(Guid id)
    {
        var sucesso = await _pessoaService.DeleteAsync(id);

        if (!sucesso)
            return NotFound($"Pessoa com ID {id} não encontrada");

        return NoContent();
    }

    /// <summary>
    /// Listar todas as pessoas
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
    {
        var pessoas = await _pessoaService.GetAllAsync();
        return Ok(pessoas);
    }

    /// <summary>
    /// Buscar uma pessoa específica por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> GetPessoa(Guid id)
    {
        var pessoa = await _pessoaService.GetByIdAsync(id);

        if (pessoa == null)
            return NotFound($"Pessoa com ID {id} não encontrada");

        return Ok(pessoa);
    }

    /// <summary>
    /// Consultar totais por pessoa
    /// </summary>
    [HttpGet("totais")]
    public async Task<ActionResult<IEnumerable<object>>> GetTotaisPorPessoa()
    {
        var totais = await _pessoaService.GetTotaisPorPessoaAsync();
        return Ok(totais);
    }
}