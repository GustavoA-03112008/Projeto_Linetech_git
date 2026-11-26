
namespace Linetech.Models
{
	public class EditarPerfilRequest
	{
		public string Nome { get; set; } = string.Empty;

		public string Email { get; set; } = string.Empty;

		public string SenhaAtual { get; set; } = string.Empty;

		public string? NovaSenha { get; set; }
	}
}
