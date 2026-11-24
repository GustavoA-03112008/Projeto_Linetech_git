
using System;

namespace Linetech.Models
{
	public class ConfiguracaoSala
	{
		public int SalaId { get; set; }

		public int AntecedenciaMinima { get; set; } = 1;

		public int DuracaoMaxima { get; set; } = 4;

		public bool ReservasRecorrentes { get; set; } = false;

		public bool PermitirCancelamento { get; set; } = true;

		public int PrazoCancelamento { get; set; } = 2;

		public bool Manutencao { get; set; } = false;

		public string? MotivoManutencao { get; set; }

		public DateTime DataAtualizacao { get; set; }


		public Sala? Sala { get; set; }

	}
}
