
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class NotificacoesController : ControllerBase
	{
		private readonly LinetechContext _context;

		public NotificacoesController(LinetechContext context)
		{
			_context = context;
		}

		// Obter ID do usuário logado
		private bool TentarObterUsuarioId(out int usuarioId)
		{
			return int.TryParse(
				User.FindFirstValue(ClaimTypes.NameIdentifier),
				out usuarioId
			);
		}

		// Listar notificações do usuário logado
		[HttpGet]
		public async Task<IActionResult> ListarNotificacoes()
		{
			if (!TentarObterUsuarioId(out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var notificacoes = await _context.Notificacoes
				.AsNoTracking()
				.Where(n => n.UsuarioId == usuarioId)
				.OrderByDescending(n => n.DataCriacao)
				.ToListAsync();

			return Ok(notificacoes);
		}

		// Contar notificações não lidas
		[HttpGet("nao-lidas/contagem")]
		public async Task<IActionResult> ContarNaoLidas()
		{
			if (!TentarObterUsuarioId(out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			int quantidade = await _context.Notificacoes
				.CountAsync(n =>
					n.UsuarioId == usuarioId &&
					!n.Lida
				);

			return Ok(new
			{
				quantidade
			});
		}

		// Marcar uma notificação como lida
		[HttpPatch("{id}/lida")]
		public async Task<IActionResult> MarcarComoLida(int id)
		{
			if (!TentarObterUsuarioId(out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var notificacao = await _context.Notificacoes
				.FirstOrDefaultAsync(n =>
					n.Id == id &&
					n.UsuarioId == usuarioId
				);

			if (notificacao == null)
				return NotFound("Notificação não encontrada.");

			notificacao.Lida = true;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Notificação marcada como lida.",
				notificacao
			});
		}

		// Marcar todas as notificações como lidas
		[HttpPatch("marcar-todas-lidas")]
		public async Task<IActionResult> MarcarTodasComoLidas()
		{
			if (!TentarObterUsuarioId(out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var notificacoes = await _context.Notificacoes
				.Where(n =>
					n.UsuarioId == usuarioId &&
					!n.Lida
				)
				.ToListAsync();

			foreach (var notificacao in notificacoes)
			{
				notificacao.Lida = true;
			}

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Todas as notificações foram marcadas como lidas.",
				quantidade = notificacoes.Count
			});
		}

		// Excluir uma notificação
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirNotificacao(int id)
		{
			if (!TentarObterUsuarioId(out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var notificacao = await _context.Notificacoes
				.FirstOrDefaultAsync(n =>
					n.Id == id &&
					n.UsuarioId == usuarioId
				);

			if (notificacao == null)
				return NotFound("Notificação não encontrada.");

			_context.Notificacoes.Remove(notificacao);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Notificação excluída com sucesso."
			});
		}
	}
}
