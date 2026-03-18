using System.ComponentModel.DataAnnotations;

namespace ControleGastosResidenciais.Api.Models;

/// <summary>
/// Representa uma pessoa no sistema de controle de gastos
/// </summary>
public class Pessoa
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }

}