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
		public DbSet<Atividade> Atividades { get; set; }
		public DbSet<SolicitacaoAcesso> SolicitacoesAcesso { get; set; }
		public DbSet<ConfiguracaoSala> ConfiguracoesSalas { get; set; }
		public DbSet<PermissaoSala> PermissoesSalas { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Recursos
			modelBuilder.Entity<Recurso>(entity =>
			{
				entity.HasKey(r => r.Id)
					.HasName("PK__Recursos__3214EC07F18721C3");

				entity.Property(r => r.Nome)
					.HasMaxLength(120);

				entity.Property(r => r.Descricao)
					.HasMaxLength(500);
			});

			// Usuários
			modelBuilder.Entity<Usuario>(entity =>
			{
				entity.HasKey(u => u.Id)
					.HasName("PK__Usuarios__3214EC071151B67D");

				entity.Property(u => u.Nome)
					.HasMaxLength(120);

				entity.Property(u => u.Email)
					.HasMaxLength(180);

				entity.Property(u => u.SenhaHash)
					.HasMaxLength(255);

				entity.Property(u => u.Perfil)
					.HasMaxLength(30)
					.HasDefaultValue("Professor");

				entity.Property(u => u.Ativo)
					.HasDefaultValue(true);

				entity.Property(u => u.DataCriacao)
					.HasDefaultValueSql("SYSDATETIME()");

				entity.HasIndex(u => u.Email)
					.IsUnique()
					.HasDatabaseName("UX_Usuarios_Email");
			});

			// Reservas
			modelBuilder.Entity<Reserva>(entity =>
			{
				entity.HasKey(r => r.Id)
					.HasName("PK__Reservas__3214EC0794F98BA2");

				entity.Property(r => r.Finalidade)
					.HasMaxLength(250);

				entity.Property(r => r.Status)
					.HasMaxLength(20)
					.HasDefaultValue("Pendente");

				entity.Property(r => r.DataCriacao)
					.HasDefaultValueSql("SYSDATETIME()");

				entity.HasIndex(r => new
				{
					r.SalaId,
					r.DataInicio,
					r.DataFim
				})
					.HasDatabaseName("IX_Reservas_Sala_Periodo");

				entity.HasOne<Usuario>()
					.WithMany()
					.HasForeignKey(r => r.UsuarioId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_Reservas_Usuarios");

				entity.HasOne<Sala>()
					.WithMany()
					.HasForeignKey(r => r.SalaId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_Reservas_Salas");
			});

			// Atividades
			modelBuilder.Entity<Atividade>(entity =>
			{
				entity.HasKey(a => a.Id)
					.HasName("PK__Atividad__3214EC074AAFCC97");

				entity.Property(a => a.Nome)
					.HasMaxLength(150);

				entity.Property(a => a.Descricao)
					.HasMaxLength(500);

				entity.HasOne<Reserva>()
					.WithMany()
					.HasForeignKey(a => a.ReservaId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_Atividades_Reservas");
			});

			// Solicitações de acesso
			modelBuilder.Entity<SolicitacaoAcesso>(entity =>
			{
				entity.HasKey(s => s.Id)
					.HasName("PK__Solicita__3214EC07529A6D56");

				entity.Property(s => s.Funcao)
					.HasMaxLength(50);

				entity.Property(s => s.Status)
					.HasMaxLength(20)
					.HasDefaultValue("Pendente");

				entity.Property(s => s.DataSolicitacao)
					.HasDefaultValueSql("SYSDATETIME()");

				entity.Property(s => s.Observacao)
					.HasMaxLength(500);

				entity.HasOne<Usuario>()
					.WithMany()
					.HasForeignKey(s => s.UsuarioId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_SolicitacoesAcesso_Usuario");

				entity.HasOne<Usuario>()
					.WithMany()
					.HasForeignKey(s => s.GestorId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_SolicitacoesAcesso_Gestor")
					.IsRequired(false);
			});

			// Associação entre salas e recursos
			modelBuilder.Entity<SalaRecurso>(entity =>
			{
				entity.HasKey(sr => new { sr.SalaId, sr.RecursoId })
					.HasName("PK_SalaRecursos");

				entity.Property(sr => sr.Quantidade)
					.IsRequired()
					.HasDefaultValue(1);

				entity.HasOne(sr => sr.Sala)
					.WithMany()
					.HasForeignKey(sr => sr.SalaId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_SalaRecursos_Salas");

				entity.HasOne(sr => sr.Recurso)
					.WithMany()
					.HasForeignKey(sr => sr.RecursoId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_SalaRecursos_Recursos");
			});

			// Configurações individuais de cada sala
			modelBuilder.Entity<ConfiguracaoSala>(entity =>
			{
				entity.ToTable("ConfiguracoesSala");

				entity.HasKey(c => c.SalaId)
					.HasName("PK_ConfiguracoesSala");

				entity.Property(c => c.AntecedenciaMinima)
					.IsRequired()
					.HasDefaultValue(1);

				entity.Property(c => c.DuracaoMaxima)
					.IsRequired()
					.HasDefaultValue(4);

				entity.Property(c => c.ReservasRecorrentes)
					.IsRequired()
					.HasDefaultValue(false);

				entity.Property(c => c.PermitirCancelamento)
					.IsRequired()
					.HasDefaultValue(true);

				entity.Property(c => c.PrazoCancelamento)
					.IsRequired()
					.HasDefaultValue(2);

				entity.Property(c => c.Manutencao)
					.IsRequired()
					.HasDefaultValue(false);

				entity.Property(c => c.MotivoManutencao)
					.HasMaxLength(500);

				entity.Property(c => c.DataAtualizacao)
					.IsRequired()
					.HasDefaultValueSql("SYSDATETIME()");

				entity.HasOne(c => c.Sala)
					.WithMany()
					.HasForeignKey(c => c.SalaId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_ConfiguracoesSala_Salas");
			});

			// Permissões individuais de cada sala
			modelBuilder.Entity<PermissaoSala>(entity =>
			{
				entity.ToTable("PermissoesSala");

				entity.HasKey(p => p.SalaId)
					.HasName("PK_PermissoesSala");

				entity.Property(p => p.Professor)
					.IsRequired()
					.HasDefaultValue(true);

				entity.Property(p => p.Gestor)
					.IsRequired()
					.HasDefaultValue(true);

				entity.Property(p => p.PermitirReservas)
					.IsRequired()
					.HasDefaultValue(true);

				entity.Property(p => p.AcessoRestrito)
					.IsRequired()
					.HasDefaultValue(false);

				entity.HasOne(p => p.Sala)
					.WithMany()
					.HasForeignKey(p => p.SalaId)
					.OnDelete(DeleteBehavior.NoAction)
					.HasConstraintName("FK_PermissoesSala_Salas");
			});
		}
	}
}