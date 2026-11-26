
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
	public class ReservasController : ControllerBase
	{
		private readonly LinetechContext _context;

		public ReservasController(LinetechContext context)
		{
			_context = context;
		}

		// Listar todas as reservas - somente Gestor
		[Authorize(Roles = "Gestor")]
		[HttpGet]
		public async Task<IActionResult> ListarReservas()
		{
			var reservas = await _context.Reservas
				.AsNoTracking()
				.OrderByDescending(r => r.DataInicio)
				.ToListAsync();

			return Ok(reservas);
		}

		// Listar próximas reservas do usuário logado
		[Authorize]
		[HttpGet("minhas/proximas")]
		public async Task<IActionResult> ListarMinhasProximasReservas()
		{
			if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var agora = DateTime.Now;

			var reservas = await (
				from reserva in _context.Reservas.AsNoTracking()
				join sala in _context.Salas.AsNoTracking()
					on reserva.SalaId equals sala.Id
				where reserva.UsuarioId == usuarioId
					&& reserva.DataFim >= agora
					&& (reserva.Status == "Pendente" || reserva.Status == "Confirmada")
				orderby reserva.DataInicio ascending
				select new
				{
					reserva.Id,
					NomeSala = sala.Nome,
					reserva.DataInicio,
					reserva.DataFim,
					reserva.Finalidade,
					reserva.Status
				}
			).Take(3).ToListAsync();

			return Ok(reservas);
		}

		// Listar reservas do usuário logado
		[Authorize]
		[HttpGet("minhas")]
		public async Task<IActionResult> ListarMinhasReservas()
		{
			if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			var reservas = await (
				from reserva in _context.Reservas.AsNoTracking()
				join sala in _context.Salas.AsNoTracking()
					on reserva.SalaId equals sala.Id
				where reserva.UsuarioId == usuarioId
				orderby reserva.DataInicio descending
				select new
				{
					reserva.Id,
					reserva.UsuarioId,
					reserva.SalaId,
					NomeSala = sala.Nome,
					reserva.DataInicio,
					reserva.DataFim,
					reserva.Finalidade,
					reserva.Status,
					reserva.DataCriacao
				}
			).ToListAsync();

			return Ok(reservas);
		}

		// Consultar uma reserva pelo ID
		[Authorize]
		[HttpGet("{id}")]
		public async Task<IActionResult> BuscarReserva(int id)
		{
			var reserva = await _context.Reservas
				.AsNoTracking()
				.FirstOrDefaultAsync(r => r.Id == id);

			if (reserva == null)
				return NotFound("Reserva não encontrada.");

			bool ehGestor = User.IsInRole("Gestor");

			if (!ehGestor &&
				(!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int usuarioId)
				 || reserva.UsuarioId != usuarioId))
			{
				return Forbid();
			}

			return Ok(reserva);
		}

		// Cadastrar uma nova reserva
		[Authorize]
		[HttpPost]
		public async Task<IActionResult> CadastrarReserva(
			[FromBody] CadastrarReservaRequest dados)
		{
			if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int usuarioId))
				return Unauthorized("Usuário não identificado.");

			if (dados.SalaId <= 0)
				return BadRequest("Informe uma sala válida.");

			if (string.IsNullOrWhiteSpace(dados.Finalidade))
				return BadRequest("Informe a finalidade da reserva.");

			if (dados.DataFim <= dados.DataInicio)
				return BadRequest("A data final deve ser posterior à data inicial.");

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == usuarioId && u.Ativo);

			if (usuario == null)
				return Unauthorized("Usuário não encontrado ou inativo.");

			var sala = await _context.Salas
				.FirstOrDefaultAsync(s => s.Id == dados.SalaId && s.Disponivel);

			if (sala == null)
				return BadRequest("Sala não encontrada ou indisponível.");

			var configuracao = await _context.ConfiguracoesSalas
				.FirstOrDefaultAsync(c => c.SalaId == dados.SalaId);

			int antecedenciaMinima = configuracao?.AntecedenciaMinima ?? 1;
			int duracaoMaxima = configuracao?.DuracaoMaxima ?? 4;

			if (configuracao?.Manutencao == true)
				return BadRequest("Não é possível reservar esta sala, pois ela está em manutenção.");

			var agora = DateTime.Now;

			var dataInicio = dados.DataInicio.Kind == DateTimeKind.Utc
				? dados.DataInicio.ToLocalTime()
				: dados.DataInicio;

			var dataLimite = agora.AddDays(antecedenciaMinima);

			if (dataInicio < dataLimite)
				return BadRequest($"A reserva deve ser realizada com pelo menos {antecedenciaMinima} dia(s) de antecedência.");

			if (dados.DataFim > dados.DataInicio.AddHours(duracaoMaxima))
				return BadRequest($"A duração máxima permitida para esta sala é de {duracaoMaxima} hora(s).");

			bool conflito = await _context.Reservas.AnyAsync(r =>
				r.SalaId == dados.SalaId &&
				(r.Status == "Pendente" || r.Status == "Confirmada") &&
				dados.DataInicio < r.DataFim &&
				dados.DataFim > r.DataInicio);

			if (conflito)
				return Conflict(new { mensagem = "A sala já possui uma reserva nesse período." });

			var reserva = new Reserva
			{
				UsuarioId = usuarioId,
				SalaId = dados.SalaId,
				DataInicio = dados.DataInicio,
				DataFim = dados.DataFim,
				Finalidade = dados.Finalidade.Trim(),
				Status = "Pendente",
				DataCriacao = DateTime.Now
			};

			_context.Reservas.Add(reserva);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(BuscarReserva), new { id = reserva.Id }, reserva);
		}

		// Editar uma reserva - somente Gestor
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarReserva(
			int id,
			[FromBody] EditarReservaRequest dados)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
				return NotFound("Reserva não encontrada.");

			if (dados.UsuarioId <= 0 || dados.SalaId <= 0)
				return BadRequest("Informe um usuário e uma sala válidos.");

			if (string.IsNullOrWhiteSpace(dados.Finalidade))
				return BadRequest("Informe a finalidade da reserva.");

			if (dados.DataFim <= dados.DataInicio)
				return BadRequest("A data final deve ser posterior à data inicial.");

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == dados.UsuarioId && u.Ativo);

			if (usuario == null)
				return BadRequest("Usuário não encontrado ou inativo.");

			var sala = await _context.Salas
				.FirstOrDefaultAsync(s => s.Id == dados.SalaId && s.Disponivel);

			if (sala == null)
				return BadRequest("Sala não encontrada ou indisponível.");

			var statusPermitidos = new[]
			{
				"Pendente",
				"Confirmada",
				"Cancelada",
				"Recusada",
				"Concluida"
			};

			if (!statusPermitidos.Contains(dados.Status))
				return BadRequest("Status inválido.");

			var configuracao = await _context.ConfiguracoesSalas
				.FirstOrDefaultAsync(c => c.SalaId == dados.SalaId);

			int antecedenciaMinima = configuracao?.AntecedenciaMinima ?? 1;
			int duracaoMaxima = configuracao?.DuracaoMaxima ?? 4;

			if (dados.Status == "Pendente" || dados.Status == "Confirmada")
			{
				if (configuracao?.Manutencao == true)
					return BadRequest("Não é possível reservar esta sala, pois ela está em manutenção.");

				var dataLimite = DateTime.Now.AddDays(antecedenciaMinima);

				if (dados.DataInicio < dataLimite)
					return BadRequest($"A reserva deve ser realizada com pelo menos {antecedenciaMinima} dia(s) de antecedência.");

				if (dados.DataFim > dados.DataInicio.AddHours(duracaoMaxima))
					return BadRequest($"A duração máxima permitida para esta sala é de {duracaoMaxima} hora(s).");
			}

			bool conflito = await _context.Reservas.AnyAsync(r =>
				r.Id != id &&
				r.SalaId == dados.SalaId &&
				(r.Status == "Pendente" || r.Status == "Confirmada") &&
				(dados.Status == "Pendente" || dados.Status == "Confirmada") &&
				dados.DataInicio < r.DataFim &&
				dados.DataFim > r.DataInicio);

			if (conflito)
				return Conflict(new { mensagem = "A sala já possui uma reserva nesse período." });

			reserva.UsuarioId = dados.UsuarioId;
			reserva.SalaId = dados.SalaId;
			reserva.DataInicio = dados.DataInicio;
			reserva.DataFim = dados.DataFim;
			reserva.Finalidade = dados.Finalidade.Trim();
			reserva.Status = dados.Status;

			await _context.SaveChangesAsync();

			return Ok(reserva);
		}

		// Aprovar solicitação - somente Gestor
		[Authorize(Roles = "Gestor")]
		[HttpPost("{id}/aprovar")]
		public async Task<IActionResult> AprovarReserva(int id)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
				return NotFound("Solicitação não encontrada.");

			if (reserva.Status != "Pendente")
				return BadRequest("Somente solicitações pendentes podem ser aprovadas.");

			var conflito = await _context.Reservas.AnyAsync(r =>
				r.Id != id &&
				r.SalaId == reserva.SalaId &&
				r.Status == "Confirmada" &&
				reserva.DataInicio < r.DataFim &&
				reserva.DataFim > r.DataInicio);

			if (conflito)
				return Conflict(new { mensagem = "Já existe uma reserva confirmada nesse período." });

			reserva.Status = "Confirmada";

			// Criar notificação de aprovação
			var notificacao = new Notificacao
			{
				UsuarioId = reserva.UsuarioId,
				Titulo = "Reserva aprovada",
				Mensagem = "Sua solicitação de reserva foi aprovada com sucesso.",
				Tipo = "ReservaAprovada",
				ReservaId = reserva.Id,
				SalaId = reserva.SalaId,
				Lida = false,
				DataCriacao = DateTime.Now
			};

			_context.Notificacoes.Add(notificacao);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Solicitação aprovada com sucesso.",
				reserva
			});
		}

		// Recusar solicitação - somente Gestor
		[Authorize(Roles = "Gestor")]
		[HttpPatch("{id}/recusar")]
		public async Task<IActionResult> RecusarReserva(int id)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
				return NotFound("Solicitação não encontrada.");

			if (reserva.Status != "Pendente")
				return BadRequest("Somente solicitações pendentes podem ser recusadas.");

			reserva.Status = "Recusada";

			// Criar notificação de recusa
			var notificacao = new Notificacao
			{
				UsuarioId = reserva.UsuarioId,
				Titulo = "Reserva recusada",
				Mensagem = "Sua solicitação de reserva foi recusada.",
				Tipo = "ReservaRecusada",
				ReservaId = reserva.Id,
				SalaId = reserva.SalaId,
				Lida = false,
				DataCriacao = DateTime.Now
			};

			_context.Notificacoes.Add(notificacao);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Solicitação recusada com sucesso.",
				reserva
			});
		}

		// Cancelar reserva - dono da reserva ou Gestor
		[Authorize]
		[HttpPatch("{id}/cancelar")]
		public async Task<IActionResult> CancelarReserva(int id)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
				return NotFound("Reserva não encontrada.");

			bool ehGestor = User.IsInRole("Gestor");

			if (!ehGestor &&
				(!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int usuarioId)
				 || reserva.UsuarioId != usuarioId))
			{
				return Forbid();
			}

			if (reserva.Status == "Cancelada" || reserva.Status == "Recusada")
				return BadRequest("Esta reserva já está cancelada ou recusada.");

			if (reserva.Status == "Concluida")
				return BadRequest("Não é possível cancelar uma reserva concluída.");

			var configuracao = await _context.ConfiguracoesSalas
				.FirstOrDefaultAsync(c => c.SalaId == reserva.SalaId);

			if (configuracao?.PermitirCancelamento == false)
				return BadRequest("O cancelamento de reservas não está permitido para esta sala.");

			int prazoCancelamento = configuracao?.PrazoCancelamento ?? 2;

			var prazoLimite = reserva.DataInicio.AddDays(-prazoCancelamento);

			if (DateTime.Now > prazoLimite)
				return BadRequest($"O cancelamento deve ser realizado com pelo menos {prazoCancelamento} dia(s) de antecedência.");

			reserva.Status = "Cancelada";

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Reserva cancelada com sucesso.",
				reserva
			});
		}

		// Excluir solicitação recusada ou cancelada - somente Gestor
		[Authorize(Roles = "Gestor")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirReservaRecusada(int id)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
				return NotFound("Solicitação não encontrada.");

			if (reserva.Status != "Recusada" && reserva.Status != "Cancelada")
				return BadRequest("Somente solicitações recusadas ou canceladas podem ser excluídas.");

			_context.Reservas.Remove(reserva);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Solicitação excluída com sucesso."
			});
		}
	}
}
