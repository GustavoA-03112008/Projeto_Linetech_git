
namespace Linetech.Models
{
	public class Reserva
	{
		public int Id { get; set; }

		public int UsuarioId { get; set; }

		public int SalaId { get; set; }

		public DateTime DataInicio { get; set; }

		public DateTime DataFim { get; set; }
		public string? Finalidade { get; set; }

		public string Status { get; set; } = "Pendente";

		public DateTime DataCriacao { get; set; }
	}
}
