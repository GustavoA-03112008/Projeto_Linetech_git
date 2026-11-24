
namespace Linetech.Models
{
	public class SalaRecurso
	{
		public int SalaId { get; set; }

		public int RecursoId { get; set; }

		public int Quantidade { get; set; } = 1;

		public Sala Sala { get; set; } = null!;

		public Recurso Recurso { get; set; } = null!;
	}
}
