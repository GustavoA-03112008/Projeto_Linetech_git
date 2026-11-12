
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Linetech.Migrations
{
	public partial class SincronizarModeloBanco : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateIndex(
				name: "IX_Atividades_ReservaId",
				table: "Atividades",
				column: "ReservaId");

			migrationBuilder.CreateIndex(
				name: "IX_Reservas_UsuarioId",
				table: "Reservas",
				column: "UsuarioId");

			migrationBuilder.CreateIndex(
				name: "IX_SalaRecursos_RecursoId",
				table: "SalaRecursos",
				column: "RecursoId");

			migrationBuilder.CreateIndex(
				name: "IX_SolicitacoesAcesso_GestorId",
				table: "SolicitacoesAcesso",
				column: "GestorId");

			migrationBuilder.CreateIndex(
				name: "IX_SolicitacoesAcesso_UsuarioId",
				table: "SolicitacoesAcesso",
				column: "UsuarioId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropIndex(
				name: "IX_Atividades_ReservaId",
				table: "Atividades");

			migrationBuilder.DropIndex(
				name: "IX_Reservas_UsuarioId",
				table: "Reservas");

			migrationBuilder.DropIndex(
				name: "IX_SalaRecursos_RecursoId",
				table: "SalaRecursos");

			migrationBuilder.DropIndex(
				name: "IX_SolicitacoesAcesso_GestorId",
				table: "SolicitacoesAcesso");

			migrationBuilder.DropIndex(
				name: "IX_SolicitacoesAcesso_UsuarioId",
				table: "SolicitacoesAcesso");
		}
	}
}
