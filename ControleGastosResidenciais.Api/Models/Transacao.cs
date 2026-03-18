using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastosResidenciais.Api.Models;

/// <summary>
/// Representa uma transação financeira (receita ou despesa)
/// </summary>
public class Transacao
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public Guid CategoriaId { get; set; }
    public Guid PessoaId { get; set; }
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

}