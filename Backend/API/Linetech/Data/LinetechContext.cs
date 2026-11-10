
using Microsoft.EntityFrameworkCore;
using Linetech.Models;

namespace Linetech.Data
{
	public class LinetechContext : DbContext
	{
		public LinetechContext(
			DbContextOptions<LinetechContext> options)
			: base(options)
		{
		}

		public DbSet<Sala> Salas { get; set; }

		public DbSet<Usuario> Usuarios { get; set; }

		public DbSet<Recurso> Recursos { get; set; }

		public DbSet<SalaRecurso> SalaRecursos { get; set; }

		public DbSet<Reserva> Reservas { get; set; }

		// Atividades relacionadas às reservas
		public DbSet<Atividade> Atividades { get; set; }

		// Solicitações de acesso às funções do sistema
		public DbSet<SolicitacaoAcesso> SolicitacoesAcesso { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Chave composta da associação entre salas e recursos
			modelBuilder.Entity<SalaRecurso>()
				.HasKey(sr => new { sr.SalaId, sr.RecursoId });
		}
	}
}
