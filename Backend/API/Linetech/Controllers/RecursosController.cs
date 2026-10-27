
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
	}
}
