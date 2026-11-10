
namespace Linetech.Models
{
	public class CadastrarAtividadeRequest
	{
		public int ReservaId { get; set; }

		public string Nome { get; set; } = string.Empty;

		public string? Descricao { get; set; }

		public DateTime DataInicio { get; set; }

		public DateTime DataFim { get; set; }
	}
}
