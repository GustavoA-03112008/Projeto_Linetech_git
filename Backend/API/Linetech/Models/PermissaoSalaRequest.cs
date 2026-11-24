namespace Linetech.Models
{
	public class PermissaoSalaRequest
	{
		public bool Professor { get; set; }

		public bool Gestor { get; set; }

		public bool PermitirReservas { get; set; }

		public bool AcessoRestrito { get; set; }
	}
}