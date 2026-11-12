
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

		// Listar todas as reservas
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
			var usuarioIdTexto = User.FindFirstValue(
				ClaimTypes.NameIdentifier
			);

			if (!int.TryParse(usuarioIdTexto, out int usuarioId))
			{
				return Unauthorized("Usuário não identificado.");
			}

			var agora = DateTime.Now;

			var reservas = await (
				from reserva in _context.Reservas.AsNoTracking()
				join sala in _context.Salas.AsNoTracking()
					on reserva.SalaId equals sala.Id
				where reserva.UsuarioId == usuarioId
					&& reserva.DataFim >= agora
					&& (reserva.Status == "Pendente"
						|| reserva.Status == "Confirmada")
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
			)
			.Take(3)
			.ToListAsync();

			return Ok(reservas);
		}

		// Consultar uma reserva pelo ID
		[HttpGet("{id}")]
		public async Task<IActionResult> BuscarReserva(int id)
		{
			var reserva = await _context.Reservas
				.AsNoTracking()
				.FirstOrDefaultAsync(r => r.Id == id);

			if (reserva == null)
			{
				return NotFound("Reserva não encontrada.");
			}

			return Ok(reserva);
		}

		// Cadastrar uma nova reserva
		[HttpPost]
		public async Task<IActionResult> CadastrarReserva(
			[FromBody] CadastrarReservaRequest dados)
		{
			if (dados.UsuarioId <= 0 || dados.SalaId <= 0)
			{
				return BadRequest(
					"Informe um usuário e uma sala válidos."
				);
			}

			if (string.IsNullOrWhiteSpace(dados.Finalidade))
			{
				return BadRequest(
					"Informe a finalidade da reserva."
				);
			}

			if (dados.DataFim <= dados.DataInicio)
			{
				return BadRequest(
					"A data final deve ser posterior à data inicial."
				);
			}

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u =>
					u.Id == dados.UsuarioId && u.Ativo);

			if (usuario == null)
			{
				return BadRequest(
					"Usuário não encontrado ou inativo."
				);
			}

			var sala = await _context.Salas
				.FirstOrDefaultAsync(s =>
					s.Id == dados.SalaId && s.Disponivel);

			if (sala == null)
			{
				return BadRequest(
					"Sala não encontrada ou indisponível."
				);
			}

			bool conflito = await _context.Reservas.AnyAsync(r =>
				r.SalaId == dados.SalaId &&
				(r.Status == "Pendente" ||
				 r.Status == "Confirmada") &&
				dados.DataInicio < r.DataFim &&
				dados.DataFim > r.DataInicio);

			if (conflito)
			{
				return Conflict(new
				{
					mensagem =
						"A sala já possui uma reserva nesse período."
				});
			}

			var reserva = new Reserva
			{
				UsuarioId = dados.UsuarioId,
				SalaId = dados.SalaId,
				DataInicio = dados.DataInicio,
				DataFim = dados.DataFim,
				Finalidade = dados.Finalidade.Trim(),
				Status = "Pendente",
				DataCriacao = DateTime.Now
			};

			_context.Reservas.Add(reserva);
			await _context.SaveChangesAsync();

			return CreatedAtAction(
				nameof(BuscarReserva),
				new { id = reserva.Id },
				reserva
			);
		}

		// Editar uma reserva existente
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarReserva(
			int id,
			[FromBody] EditarReservaRequest dados)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
			{
				return NotFound("Reserva não encontrada.");
			}

			if (dados.UsuarioId <= 0 || dados.SalaId <= 0)
			{
				return BadRequest(
					"Informe um usuário e uma sala válidos."
				);
			}

			if (string.IsNullOrWhiteSpace(dados.Finalidade))
			{
				return BadRequest(
					"Informe a finalidade da reserva."
				);
			}

			if (dados.DataFim <= dados.DataInicio)
			{
				return BadRequest(
					"A data final deve ser posterior à data inicial."
				);
			}

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u =>
					u.Id == dados.UsuarioId && u.Ativo);

			if (usuario == null)
			{
				return BadRequest(
					"Usuário não encontrado ou inativo."
				);
			}

			var sala = await _context.Salas
				.FirstOrDefaultAsync(s =>
					s.Id == dados.SalaId && s.Disponivel);

			if (sala == null)
			{
				return BadRequest(
					"Sala não encontrada ou indisponível."
				);
			}

			var statusPermitidos = new[]
			{
				"Pendente",
				"Confirmada",
				"Cancelada",
				"Concluida"
			};

			if (!statusPermitidos.Contains(dados.Status))
			{
				return BadRequest("Status inválido.");
			}

			bool conflito = await _context.Reservas.AnyAsync(r =>
				r.Id != id &&
				r.SalaId == dados.SalaId &&
				(r.Status == "Pendente" ||
				 r.Status == "Confirmada") &&
				(dados.Status == "Pendente" ||
				 dados.Status == "Confirmada") &&
				dados.DataInicio < r.DataFim &&
				dados.DataFim > r.DataInicio);

			if (conflito)
			{
				return Conflict(new
				{
					mensagem =
						"A sala já possui uma reserva nesse período."
				});
			}

			reserva.UsuarioId = dados.UsuarioId;
			reserva.SalaId = dados.SalaId;
			reserva.DataInicio = dados.DataInicio;
			reserva.DataFim = dados.DataFim;
			reserva.Finalidade = dados.Finalidade.Trim();
			reserva.Status = dados.Status;

			await _context.SaveChangesAsync();

			return Ok(reserva);
		}

		// Cancelar uma reserva
		[HttpPatch("{id}/cancelar")]
		public async Task<IActionResult> CancelarReserva(int id)
		{
			var reserva = await _context.Reservas.FindAsync(id);

			if (reserva == null)
			{
				return NotFound("Reserva não encontrada.");
			}

			if (reserva.Status == "Cancelada")
			{
				return BadRequest(
					"Esta reserva já está cancelada."
				);
			}

			if (reserva.Status == "Concluida")
			{
				return BadRequest(
					"Não é possível cancelar uma reserva concluída."
				);
			}

			reserva.Status = "Cancelada";

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Reserva cancelada com sucesso.",
				reserva
			});
		}
	}
}
