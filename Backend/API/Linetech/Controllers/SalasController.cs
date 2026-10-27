
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Linetech.Data;
using Linetech.Models;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SalasController : ControllerBase
	{
		private readonly LinetechContext _context;

		public SalasController(LinetechContext context)
		{
			_context = context;
		}

		// Listar todas as salas
		[HttpGet]
		public async Task<IActionResult> ListarSalas()
		{
			var salas = await _context.Salas
				.AsNoTracking()
				.ToListAsync();

			return Ok(salas);
		}

		// Cadastrar uma nova sala
		[HttpPost]
		public async Task<IActionResult> CadastrarSala(
			[FromBody] CadastrarSalaRequest dados)
		{
			var sala = new Sala
			{
				Nome = dados.Nome,
				Capacidade = dados.Capacidade,
				Disponivel = dados.Disponivel
			};

			_context.Salas.Add(sala);
			await _context.SaveChangesAsync();

			return CreatedAtAction(
				nameof(ListarSalas),
				new { id = sala.Id },
				sala
			);
		}

		// Editar uma sala existente
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarSala(
			int id,
			[FromBody] Sala sala)
		{
			if (id != sala.Id)
			{
				return BadRequest(
					"O ID da URL deve ser igual ao ID da sala."
				);
			}

			var salaExistente = await _context.Salas.FindAsync(id);

			if (salaExistente == null)
			{
				return NotFound("Sala não encontrada.");
			}

			salaExistente.Nome = sala.Nome;
			salaExistente.Capacidade = sala.Capacidade;
			salaExistente.Disponivel = sala.Disponivel;

			await _context.SaveChangesAsync();

			return Ok(salaExistente);
		}

		// Excluir uma sala existente
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirSala(int id)
		{
			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
			{
				return NotFound("Sala não encontrada.");
			}

			_context.Salas.Remove(sala);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// Consultar os recursos de uma sala
		[HttpGet("{id}/recursos")]
		public async Task<IActionResult> ListarRecursosDaSala(int id)
		{
			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
			{
				return NotFound("Sala não encontrada.");
			}

			var recursos = await _context.SalaRecursos
				.Where(sr => sr.SalaId == id)
				.Join(
					_context.Recursos,
					sr => sr.RecursoId,
					r => r.Id,
					(sr, r) => r
				)
				.AsNoTracking()
				.ToListAsync();

			return Ok(recursos);
		}

		// Adicionar um recurso a uma sala
		[HttpPost("{id}/recursos/{recursoId}")]
		public async Task<IActionResult> AdicionarRecurso(
			int id, int recursoId)
		{
			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
			{
				return NotFound("Sala não encontrada.");
			}

			var recurso = await _context.Recursos.FindAsync(recursoId);

			if (recurso == null)
			{
				return NotFound("Recurso não encontrado.");
			}

			var associacao = await _context.SalaRecursos
				.FindAsync(id, recursoId);

			if (associacao != null)
			{
				return Conflict(
					"Este recurso já está associado à sala."
				);
			}

			_context.SalaRecursos.Add(new SalaRecurso
			{
				SalaId = id,
				RecursoId = recursoId
			});

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Recurso adicionado à sala com sucesso.",
				salaId = id,
				recursoId = recursoId
			});
		}

		// Remover um recurso de uma sala
		[HttpDelete("{id}/recursos/{recursoId}")]
		public async Task<IActionResult> RemoverRecurso(
			int id, int recursoId)
		{
			var associacao = await _context.SalaRecursos
				.FindAsync(id, recursoId);

			if (associacao == null)
			{
				return NotFound(
					"Este recurso não está associado à sala."
				);
			}

			_context.SalaRecursos.Remove(associacao);
			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Recurso removido da sala com sucesso.",
				salaId = id,
				recursoId = recursoId
			});
		}
	}
}
