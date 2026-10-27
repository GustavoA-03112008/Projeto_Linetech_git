
using Linetech.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UsuariosController : ControllerBase
	{
		private readonly LinetechContext _context;

		public UsuariosController(LinetechContext context)
		{
			_context = context;
		}

		// Listar todos os usuários
		[HttpGet]
		public async Task<IActionResult> ListarUsuarios()
		{
			var usuarios = await _context.Usuarios
				.AsNoTracking()
				.Select(u => new
				{
					u.Id,
					u.Nome,
					u.Email,
					u.Ativo,
					u.DataCriacao
				})
				.OrderBy(u => u.Id)
				.ToListAsync();

			return Ok(usuarios);
		}
	}
}
