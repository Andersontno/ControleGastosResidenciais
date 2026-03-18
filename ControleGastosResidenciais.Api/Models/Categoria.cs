using System.ComponentModel.DataAnnotations;

namespace ControleGastosResidenciais.Api.Models;

/// <summary>
/// Representa uma categoria para classificação de transações
/// </summary>
public class Categoria
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public TipoFinalidade Finalidade { get; set; }
}