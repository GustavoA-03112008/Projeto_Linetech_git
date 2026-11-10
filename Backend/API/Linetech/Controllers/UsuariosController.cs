
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

		// LISTAR TODOS OS USUÁRIOS
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
					u.Perfil,
					u.Ativo,
					u.DataCriacao
				})
				.OrderBy(u => u.Id)
				.ToListAsync();

			return Ok(usuarios);
		}

		// EDITAR USUÁRIO
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarUsuario(
			int id,
			[FromBody] EditarUsuarioRequest dados)
		{
			if (dados == null ||
				string.IsNullOrWhiteSpace(dados.Nome) ||
				string.IsNullOrWhiteSpace(dados.Email) ||
				string.IsNullOrWhiteSpace(dados.Perfil))
			{
				return BadRequest(new
				{
					mensagem = "Preencha nome, e-mail e perfil."
				});
			}

			string perfil = dados.Perfil.Trim();

			if (perfil != "Gestor" && perfil != "Professor")
			{
				return BadRequest(new
				{
					mensagem = "O perfil deve ser Gestor ou Professor."
				});
			}

			string email = dados.Email.Trim().ToLowerInvariant();

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == id);

			if (usuario == null || !usuario.Ativo)
			{
				return NotFound(new
				{
					mensagem = "Usuário não encontrado ou inativo."
				});
			}

			bool emailExiste = await _context.Usuarios
				.AnyAsync(u => u.Email == email && u.Id != id);

			if (emailExiste)
			{
				return Conflict(new
				{
					mensagem = "Este e-mail já está cadastrado."
				});
			}

			// Impede retirar o último Gestor ativo
			if (usuario.Perfil == "Gestor" && perfil == "Professor")
			{
				int quantidadeGestores = await _context.Usuarios
					.CountAsync(u => u.Perfil == "Gestor" && u.Ativo);

				if (quantidadeGestores <= 1)
				{
					return BadRequest(new
					{
						mensagem = "Não é possível rebaixar o último Gestor ativo."
					});
				}
			}

			usuario.Nome = dados.Nome.Trim();
			usuario.Email = email;
			usuario.Perfil = perfil;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Usuário atualizado com sucesso.",
				usuario.Id,
				usuario.Nome,
				usuario.Email,
				usuario.Perfil
			});
		}

		// DESATIVAR USUÁRIO E CANCELAR SUAS RESERVAS
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}/desativar")]
		public async Task<IActionResult> DesativarUsuario(int id)
		{
			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == id);

			if (usuario == null)
			{
				return NotFound(new
				{
					mensagem = "Usuário não encontrado."
				});
			}

			if (!usuario.Ativo)
			{
				return BadRequest(new
				{
					mensagem = "Este usuário já está desativado."
				});
			}

			if (usuario.Perfil == "Gestor")
			{
				int quantidadeGestores = await _context.Usuarios
					.CountAsync(u => u.Perfil == "Gestor" && u.Ativo);

				if (quantidadeGestores <= 1)
				{
					return BadRequest(new
					{
						mensagem = "Não é possível desativar o último Gestor ativo."
					});
				}
			}

			var reservas = await _context.Reservas
				.Where(r => r.UsuarioId == id && r.Status != "Cancelada")
				.ToListAsync();

			foreach (var reserva in reservas)
			{
				reserva.Status = "Cancelada";
			}

			usuario.Ativo = false;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Usuário desativado e reservas canceladas.",
				usuarioId = usuario.Id,
				reservasCanceladas = reservas.Count
			});
		}

		// REATIVAR USUÁRIO
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}/ativar")]
		public async Task<IActionResult> AtivarUsuario(int id)
		{
			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == id);

			if (usuario == null)
			{
				return NotFound(new
				{
					mensagem = "Usuário não encontrado."
				});
			}

			if (usuario.Ativo)
			{
				return BadRequest(new
				{
					mensagem = "Este usuário já está ativo."
				});
			}

			usuario.Ativo = true;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Usuário reativado com sucesso.",
				usuarioId = usuario.Id,
				usuario.Nome,
				usuario.Email,
				usuario.Perfil,
				usuario.Ativo
			});
		}

		// EXCLUIR DEFINITIVAMENTE USUÁRIO E SEUS REGISTROS
		[Authorize(Roles = "Gestor")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirUsuario(int id)
		{
			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == id);

			if (usuario == null)
			{
				return NotFound(new
				{
					mensagem = "Usuário não encontrado."
				});
			}

			// Impede excluir o último Gestor ativo
			if (usuario.Ativo && usuario.Perfil == "Gestor")
			{
				int quantidadeGestores = await _context.Usuarios
					.CountAsync(u => u.Perfil == "Gestor" && u.Ativo);

				if (quantidadeGestores <= 1)
				{
					return BadRequest(new
					{
						mensagem = "Não é possível excluir o último Gestor ativo."
					});
				}
			}

			// Identifica as reservas do usuário
			var reservas = await _context.Reservas
				.Where(r => r.UsuarioId == id)
				.ToListAsync();

			var idsReservas = reservas.Select(r => r.Id).ToList();

			// Exclui as atividades vinculadas às reservas
			var atividades = await _context.Atividades
				.Where(a => idsReservas.Contains(a.ReservaId))
				.ToListAsync();

			_context.Atividades.RemoveRange(atividades);

			// Exclui as reservas
			_context.Reservas.RemoveRange(reservas);

			// Exclui solicitações em que o usuário é solicitante
			// ou Gestor responsável pela decisão
			var solicitacoes = await _context.SolicitacoesAcesso
				.Where(s => s.UsuarioId == id || s.GestorId == id)
				.ToListAsync();

			_context.SolicitacoesAcesso.RemoveRange(solicitacoes);

			// Exclui definitivamente o usuário
			_context.Usuarios.Remove(usuario);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Usuário e registros relacionados excluídos definitivamente.",
				usuarioId = id,
				reservasExcluidas = reservas.Count,
				atividadesExcluidas = atividades.Count,
				solicitacoesExcluidas = solicitacoes.Count
			});
		}
	}

	// MODELO PARA EDIÇÃO DE USUÁRIO
	public class EditarUsuarioRequest
	{
		public string Nome { get; set; } = string.Empty;

		public string Email { get; set; } = string.Empty;

		public string Perfil { get; set; } = string.Empty;
	}
}
