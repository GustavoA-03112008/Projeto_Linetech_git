namespace Linetech.Models
{
	public class PermissaoSala
	{
		public int SalaId { get; set; }

		public bool Professor { get; set; } = true;

		public bool Gestor { get; set; } = true;

		public bool PermitirReservas { get; set; } = true;

		public bool AcessoRestrito { get; set; } = false;

		public Sala? Sala { get; set; }
	}
}