using ControleGastosResidenciais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Api.Data;

/// <summary>
/// Contexto do banco de dados para o sistema de controle de gastos
/// </summary>
public class ControleGastosContext : DbContext
{
    public ControleGastosContext(DbContextOptions<ControleGastosContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da entidade Pessoa
        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Idade).IsRequired();
        });

        // Configuração da entidade Categoria
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Descricao).HasMaxLength(400).IsRequired();
            entity.Property(e => e.Finalidade).IsRequired();
        });

        // Configuração da entidade Transacao
        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Descricao).HasMaxLength(400).IsRequired();
            entity.Property(e => e.Valor).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.Tipo).IsRequired();
            entity.Property(e => e.DataCriacao).IsRequired();

            // Relacionamentos
            entity.HasOne<Pessoa>()
                  .WithMany()
                  .HasForeignKey(t => t.PessoaId)
                  .OnDelete(DeleteBehavior.Cascade); // Deleta transações quando pessoa for excluída

            entity.HasOne<Categoria>()
                  .WithMany()
                  .HasForeignKey(t => t.CategoriaId)
                  .OnDelete(DeleteBehavior.Restrict); // Não permite deletar categoria com transações
        });
    }
}