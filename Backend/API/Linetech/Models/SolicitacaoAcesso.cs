
namespace Linetech.Models
{
	public class SolicitacaoAcesso
	{
		public int Id { get; set; }

		public int UsuarioId { get; set; }

		public string Funcao { get; set; } = string.Empty;

		public string Status { get; set; } = "Pendente";

		public DateTime DataSolicitacao { get; set; }

		public int? GestorId { get; set; }

		public DateTime? DataDecisao { get; set; }

		public string? Observacao { get; set; }
	}
}
