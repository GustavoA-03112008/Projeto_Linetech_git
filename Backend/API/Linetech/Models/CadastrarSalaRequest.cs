
namespace Linetech.Models
{
	public class CadastrarSalaRequest
	{
		public string Nome { get; set; } = string.Empty;

		public int Capacidade { get; set; }

		public bool Disponivel { get; set; } = true;
	}
}
