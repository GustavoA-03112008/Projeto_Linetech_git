
namespace Linetech.Models
{
	public class CadastrarReservaRequest
	{
		public int UsuarioId { get; set; }

		public int SalaId { get; set; }

		public DateTime DataInicio { get; set; }

		public DateTime DataFim { get; set; }

		public string Finalidade { get; set; } = string.Empty;
	}
}
