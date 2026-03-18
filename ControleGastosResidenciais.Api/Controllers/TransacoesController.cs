using ControleGastosResidenciais.Api.Models;
using ControleGastosResidenciais.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Api.Controllers;

/// <summary>
/// Controller para gerenciar transações
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Criar uma nova transação
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Transacao>> CreateTransacao(Transacao transacao)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var novaTransacao = await _transacaoService.CreateAsync(transacao);
            return CreatedAtAction(nameof(GetTransacao), new { id = novaTransacao.Id }, novaTransacao);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Listar todas as transações
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
    {
        var transacoes = await _transacaoService.GetAllAsync();
        return Ok(transacoes);
    }

    /// <summary>
    /// Buscar uma transação específica por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Transacao>> GetTransacao(Guid id)
    {
        var transacao = await _transacaoService.GetByIdAsync(id);

        if (transacao == null)
            return NotFound($"Transação com ID {id} não encontrada");

        return Ok(transacao);
    }

    /// <summary>
    /// Listar todas as transações de uma pessoa específica
    /// </summary>
    [HttpGet("pessoa/{pessoaId}")]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoesByPessoa(Guid pessoaId)
    {
        var transacoes = await _transacaoService.GetByPessoaIdAsync(pessoaId);
        return Ok(transacoes);
    }


}