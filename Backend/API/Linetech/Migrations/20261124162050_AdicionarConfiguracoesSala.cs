
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Linetech.Migrations
{
	public partial class AdicionarConfiguracoesSala : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			// A tabela ConfiguracoesSala já existe no banco.
			// Esta migration apenas registra a alteração no histórico do EF.
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			// Não excluir a tabela existente nem seus dados.
		}
	}
}
