
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class RecursosController : ControllerBase
	{
		private readonly LinetechContext _context;

		public RecursosController(LinetechContext context)
		{
			_context = context;
		}

		// Listar todos os recursos
		[HttpGet]
		public async Task<IActionResult> Listar()
		{
			var recursos = await _context.Recursos
				.AsNoTracking()
				.OrderBy(r => r.Nome)
				.ToListAsync();

			return Ok(recursos);
		}

		// Buscar um recurso pelo ID
		[HttpGet("{id}")]
		public async Task<IActionResult> BuscarPorId(int id)
		{
			var recurso = await _context.Recursos
				.AsNoTracking()
				.FirstOrDefaultAsync(r => r.Id == id);

			if (recurso == null)
			{
				return NotFound(new
				{
					mensagem = "Recurso não encontrado."
				});
			}

			return Ok(recurso);
		}

		// Cadastrar um novo recurso
		[HttpPost]
		public async Task<IActionResult> Cadastrar(
			[FromBody] CadastrarRecursoRequest dados)
		{
			if (string.IsNullOrWhiteSpace(dados.Nome))
			{
				return BadRequest(new
				{
					mensagem = "Informe o nome do recurso."
				});
			}

			var recurso = new Recurso
			{
				Nome = dados.Nome.Trim(),
				Descricao = dados.Descricao
			};

			_context.Recursos.Add(recurso);
			await _context.SaveChangesAsync();

			return CreatedAtAction(
				nameof(BuscarPorId),
				new { id = recurso.Id },
				recurso
			);
		}

		// Editar um recurso existente
		[HttpPut("{id}")]
		public async Task<IActionResult> Editar(
			int id,
			[FromBody] EditarRecursoRequest dados)
		{
			var recurso = await _context.Recursos
				.FirstOrDefaultAsync(r => r.Id == id);

			if (recurso == null)
			{
				return NotFound(new
				{
					mensagem = "Recurso não encontrado."
				});
			}

			if (string.IsNullOrWhiteSpace(dados.Nome))
			{
				return BadRequest(new
				{
					mensagem = "Informe o nome do recurso."
				});
			}

			recurso.Nome = dados.Nome.Trim();
			recurso.Descricao = dados.Descricao;

			await _context.SaveChangesAsync();

			return Ok(recurso);
		}

		// Excluir um recurso
		[HttpDelete("{id}")]
		public async Task<IActionResult> Excluir(int id)
		{
			var recurso = await _context.Recursos
				.FirstOrDefaultAsync(r => r.Id == id);

			if (recurso == null)
			{
				return NotFound(new
				{
					mensagem = "Recurso não encontrado."
				});
			}

			_context.Recursos.Remove(recurso);
			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Recurso excluído com sucesso."
			});
		}
	}
}
