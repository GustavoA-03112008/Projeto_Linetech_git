
namespace Linetech.Models
{
	public class EditarReservaRequest
	{
		public int UsuarioId { get; set; }

		public int SalaId { get; set; }

		public DateTime DataInicio { get; set; }

		public DateTime DataFim { get; set; }

		public string Finalidade { get; set; } = string.Empty;

		public string Status { get; set; } = string.Empty;
	}
}
