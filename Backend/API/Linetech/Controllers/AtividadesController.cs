
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AtividadesController : ControllerBase
	{
		private readonly LinetechContext _context;

		public AtividadesController(LinetechContext context)
		{
			_context = context;
		}

		// Listar todas as atividades
		[HttpGet]
		public async Task<IActionResult> ListarAtividades()
		{
			var atividades = await _context.Atividades
				.AsNoTracking()
				.OrderBy(a => a.DataInicio)
				.ToListAsync();

			return Ok(atividades);
		}

		// Consultar uma atividade pelo ID
		[HttpGet("{id}")]
		public async Task<IActionResult> BuscarAtividade(int id)
		{
			var atividade = await _context.Atividades
				.AsNoTracking()
				.FirstOrDefaultAsync(a => a.Id == id);

			if (atividade == null)
			{
				return NotFound("Atividade não encontrada.");
			}

			return Ok(atividade);
		}

		// Cadastrar uma nova atividade
		[HttpPost]
		public async Task<IActionResult> CadastrarAtividade(
			[FromBody] CadastrarAtividadeRequest dados)
		{
			if (dados.ReservaId <= 0)
			{
				return BadRequest("Informe uma reserva válida.");
			}

			if (string.IsNullOrWhiteSpace(dados.Nome))
			{
				return BadRequest("Informe o nome da atividade.");
			}

			if (dados.DataFim <= dados.DataInicio)
			{
				return BadRequest(
					"A data final deve ser posterior à data inicial."
				);
			}

			var reserva = await _context.Reservas
				.FirstOrDefaultAsync(r => r.Id == dados.ReservaId);

			if (reserva == null)
			{
				return BadRequest("A reserva informada não existe.");
			}

			// Impedir atividades em reservas canceladas ou concluídas
			if (reserva.Status == "Cancelada" ||
				reserva.Status == "Concluida")
			{
				return BadRequest(
					"Não é possível cadastrar atividades em reservas canceladas ou concluídas."
				);
			}

			if (dados.DataInicio < reserva.DataInicio ||
				dados.DataFim > reserva.DataFim)
			{
				return BadRequest(
					"A atividade deve ocorrer dentro do período da reserva."
				);
			}

			var atividade = new Atividade
			{
				ReservaId = dados.ReservaId,
				Nome = dados.Nome.Trim(),
				Descricao = dados.Descricao,
				DataInicio = dados.DataInicio,
				DataFim = dados.DataFim
			};

			_context.Atividades.Add(atividade);
			await _context.SaveChangesAsync();

			return CreatedAtAction(
				nameof(BuscarAtividade),
				new { id = atividade.Id },
				atividade
			);
		}

		// Editar uma atividade existente
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarAtividade(
			int id,
			[FromBody] EditarAtividadeRequest dados)
		{
			var atividade = await _context.Atividades
				.FirstOrDefaultAsync(a => a.Id == id);

			if (atividade == null)
			{
				return NotFound("Atividade não encontrada.");
			}

			if (dados.ReservaId <= 0)
			{
				return BadRequest("Informe uma reserva válida.");
			}

			if (string.IsNullOrWhiteSpace(dados.Nome))
			{
				return BadRequest("Informe o nome da atividade.");
			}

			if (dados.DataFim <= dados.DataInicio)
			{
				return BadRequest(
					"A data final deve ser posterior à data inicial."
				);
			}

			var reserva = await _context.Reservas
				.FirstOrDefaultAsync(r => r.Id == dados.ReservaId);

			if (reserva == null)
			{
				return BadRequest("A reserva informada não existe.");
			}

			// Impedir edição em reservas canceladas ou concluídas
			if (reserva.Status == "Cancelada" ||
				reserva.Status == "Concluida")
			{
				return BadRequest(
					"Não é possível editar atividades em reservas canceladas ou concluídas."
				);
			}

			if (dados.DataInicio < reserva.DataInicio ||
				dados.DataFim > reserva.DataFim)
			{
				return BadRequest(
					"A atividade deve ocorrer dentro do período da reserva."
				);
			}

			atividade.ReservaId = dados.ReservaId;
			atividade.Nome = dados.Nome.Trim();
			atividade.Descricao = dados.Descricao;
			atividade.DataInicio = dados.DataInicio;
			atividade.DataFim = dados.DataFim;

			await _context.SaveChangesAsync();

			return Ok(atividade);
		}

		// Excluir uma atividade
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirAtividade(int id)
		{
			var atividade = await _context.Atividades
				.FirstOrDefaultAsync(a => a.Id == id);

			if (atividade == null)
			{
				return NotFound("Atividade não encontrada.");
			}

			_context.Atividades.Remove(atividade);
			await _context.SaveChangesAsync();

			return Ok("Atividade excluída com sucesso.");
		}
	}
}
