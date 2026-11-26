namespace Linetech.Models
{
	public class Notificacao
	{
		public int Id { get; set; }

		public int UsuarioId { get; set; }

		public string Titulo { get; set; } = string.Empty;

		public string Mensagem { get; set; } = string.Empty;

		public string Tipo { get; set; } = string.Empty;

		public int? ReservaId { get; set; }

		public int? SalaId { get; set; }

		public bool Lida { get; set; } = false;

		public DateTime DataCriacao { get; set; } = DateTime.Now;
	}
}