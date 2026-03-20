namespace ControleGastosResidenciais.Api.Models;

/// <summary>
/// Define os tipos de transação possíveis
/// </summary>
public enum TipoTransacao
{
    Despesa = 1,
    Receita = 2
}
/*
Observação:
    O ideal é que TipoTransacao seja uma tabela no banco de dados para criar uma relação com a tabela de transações,
    garantindo a integridade e permitindo a adição de novos tipos de transação. Porém, pelo escopo e intuito do projeto,
    achei melhor utilizar um enum para simplificar a implementação e evitar a necessidade de criar uma tabela adicional e popular dados manualmente.
*/