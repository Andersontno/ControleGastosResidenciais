namespace ControleGastosResidenciais.Api.Models;

/// <summary>
/// Define os tipos de finalidade que uma categoria pode ter
/// </summary>
public enum TipoFinalidade
{
    Despesa = 1,
    Receita = 2,
    Ambas = 3
}
/*
Observação:
    O ideal é que TipoFinalidade seja uma tabela no banco de dados para criar uma relação com a tabela de categorias,
    garantindo a integridade e permitindo a adição de novas finalidades. Porém, pelo escopo e intuito do projeto,
    achei melhor utilizar um enum para simplificar a implementação e evitar a necessidade de criar uma tabela adicional e popular dados manualmente.
*/