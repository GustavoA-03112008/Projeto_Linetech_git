
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

		// GET listar todas as salas
		[Authorize]
		[HttpGet]
		public async Task<IActionResult> ListarSalas()
		{
			var salas = await _context.Salas
				.AsNoTracking()
				.ToListAsync();

			return Ok(salas);
		}

		// GET sala por ID
		[Authorize]
		[HttpGet("{id}")]
		public async Task<IActionResult> ConsultarSala(int id)
		{
			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			return Ok(sala);
		}

		// POST cadastrar sala
		[Authorize(Roles = "Gestor")]
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
				sala);
		}

		// PUT editar sala
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}")]
		public async Task<IActionResult> EditarSala(
			int id,
			[FromBody] Sala sala)
		{
			if (id != sala.Id)
				return BadRequest(
					"O ID da URL deve ser igual ao ID da sala.");

			var salaExistente = await _context.Salas.FindAsync(id);

			if (salaExistente == null)
				return NotFound("Sala não encontrada.");

			salaExistente.Nome = sala.Nome;
			salaExistente.Capacidade = sala.Capacidade;
			salaExistente.Disponivel = sala.Disponivel;

			await _context.SaveChangesAsync();

			return Ok(salaExistente);
		}

		// DELETE excluir sala
		[Authorize(Roles = "Gestor")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> ExcluirSala(int id)
		{
			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			_context.Salas.Remove(sala);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// GET recursos da sala, incluindo quantidade
		[Authorize]
		[HttpGet("{id}/recursos")]
		public async Task<IActionResult> ListarRecursosDaSala(int id)
		{
			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			var recursos = await _context.SalaRecursos
				.Where(sr => sr.SalaId == id)
				.Join(
					_context.Recursos,
					sr => sr.RecursoId,
					r => r.Id,
					(sr, r) => new
					{
						Id = r.Id,
						Nome = r.Nome,
						Descricao = r.Descricao,
						Quantidade = sr.Quantidade
					})
				.AsNoTracking()
				.ToListAsync();

			return Ok(recursos);
		}

		// POST adicionar recurso e somar quantidade
		[Authorize(Roles = "Gestor")]
		[HttpPost("{id}/recursos/{recursoId}")]
		public async Task<IActionResult> AdicionarRecurso(
			int id,
			int recursoId,
			[FromBody] int quantidade)
		{
			if (quantidade <= 0)
				return BadRequest(
					"A quantidade deve ser maior que zero.");

			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			var recurso = await _context.Recursos.FindAsync(recursoId);

			if (recurso == null)
				return NotFound("Recurso não encontrado.");

			var associacao = await _context.SalaRecursos
				.FindAsync(id, recursoId);

			if (associacao != null)
			{
				associacao.Quantidade += quantidade;
			}
			else
			{
				_context.SalaRecursos.Add(
					new SalaRecurso
					{
						SalaId = id,
						RecursoId = recursoId,
						Quantidade = quantidade
					});
			}

			await _context.SaveChangesAsync();

			var quantidadeAtual = associacao?.Quantidade ?? quantidade;

			return Ok(new
			{
				mensagem = "Quantidade de recursos atualizada com sucesso.",
				salaId = id,
				recursoId = recursoId,
				quantidadeAdicionada = quantidade,
				quantidadeTotal = quantidadeAtual
			});
		}

		// PATCH diminuir quantidade de recurso
		[Authorize(Roles = "Gestor")]
		[HttpPatch("{id}/recursos/{recursoId}/quantidade")]
		public async Task<IActionResult> DiminuirQuantidadeRecurso(
			int id,
			int recursoId,
			[FromBody] int quantidade)
		{
			if (quantidade <= 0)
				return BadRequest(
					"A quantidade deve ser maior que zero.");

			var associacao = await _context.SalaRecursos
				.FindAsync(id, recursoId);

			if (associacao == null)
				return NotFound(
					"Este recurso não está associado à sala.");

			if (quantidade > associacao.Quantidade)
				return BadRequest(
					"A quantidade a remover é maior que a quantidade disponível.");

			associacao.Quantidade -= quantidade;

			int quantidadeRestante = associacao.Quantidade;

			if (quantidadeRestante == 0)
			{
				_context.SalaRecursos.Remove(associacao);
			}

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = quantidadeRestante == 0
					? "Recurso removido da sala."
					: "Quantidade de recursos diminuída com sucesso.",
				salaId = id,
				recursoId = recursoId,
				quantidadeRemovida = quantidade,
				quantidadeRestante = quantidadeRestante
			});
		}

		// DELETE remover completamente o recurso da sala
		[Authorize(Roles = "Gestor")]
		[HttpDelete("{id}/recursos/{recursoId}")]
		public async Task<IActionResult> RemoverRecurso(
			int id,
			int recursoId)
		{
			var associacao = await _context.SalaRecursos
				.FindAsync(id, recursoId);

			if (associacao == null)
				return NotFound(
					"Este recurso não está associado à sala.");

			_context.SalaRecursos.Remove(associacao);
			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Recurso removido da sala com sucesso.",
				salaId = id,
				recursoId = recursoId
			});
		}

		// GET disponibilidade
		[Authorize]
		[HttpGet("{id}/disponibilidade")]
		public async Task<IActionResult> ConsultarDisponibilidade(
			int id,
			[FromQuery] DateTime dataInicio,
			[FromQuery] DateTime dataFim)
		{
			if (dataFim <= dataInicio)
				return BadRequest(
					"A data final deve ser posterior à data inicial.");

			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			if (!sala.Disponivel)
			{
				return Ok(new
				{
					salaId = id,
					disponivel = false,
					mensagem = "A sala está marcada como indisponível."
				});
			}

			bool conflito = await _context.Reservas.AnyAsync(r =>
				r.SalaId == id &&
				(r.Status == "Pendente" ||
				 r.Status == "Confirmada") &&
				dataInicio < r.DataFim &&
				dataFim > r.DataInicio);

			return Ok(new
			{
				salaId = id,
				disponivel = !conflito,
				mensagem = conflito
					? "A sala já possui uma reserva nesse período."
					: "A sala está disponível nesse período."
			});
		}

		// GET consultar configurações da sala
		[Authorize]
		[HttpGet("{id}/configuracoes")]
		public async Task<IActionResult> ConsultarConfiguracoes(int id)
		{
			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			var configuracao = await _context.ConfiguracoesSalas
				.AsNoTracking()
				.FirstOrDefaultAsync(c => c.SalaId == id);

			if (configuracao == null)
			{
				configuracao = new ConfiguracaoSala
				{
					SalaId = id,
					AntecedenciaMinima = 1,
					DuracaoMaxima = 4,
					ReservasRecorrentes = false,
					PermitirCancelamento = true,
					PrazoCancelamento = 2,
					Manutencao = false,
					MotivoManutencao = null
				};
			}

			return Ok(configuracao);
		}

		// PUT cadastrar ou atualizar configurações da sala
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}/configuracoes")]
		public async Task<IActionResult> SalvarConfiguracoes(
			int id,
			[FromBody] ConfiguracaoSalaRequest dados)
		{
			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			if (dados.AntecedenciaMinima < 0)
				return BadRequest(
					"A antecedência mínima não pode ser negativa.");

			if (dados.DuracaoMaxima <= 0)
				return BadRequest(
					"A duração máxima deve ser maior que zero.");

			if (dados.PrazoCancelamento < 0)
				return BadRequest(
					"O prazo de cancelamento não pode ser negativo.");

			if (dados.Manutencao &&
				string.IsNullOrWhiteSpace(dados.MotivoManutencao))
			{
				return BadRequest(
					"Informe o motivo da manutenção.");
			}

			var configuracao = await _context.ConfiguracoesSalas
				.FirstOrDefaultAsync(c => c.SalaId == id);

			if (configuracao == null)
			{
				configuracao = new ConfiguracaoSala
				{
					SalaId = id
				};

				_context.ConfiguracoesSalas.Add(configuracao);
			}

			configuracao.AntecedenciaMinima = dados.AntecedenciaMinima;
			configuracao.DuracaoMaxima = dados.DuracaoMaxima;
			configuracao.ReservasRecorrentes = dados.ReservasRecorrentes;
			configuracao.PermitirCancelamento = dados.PermitirCancelamento;
			configuracao.PrazoCancelamento = dados.PrazoCancelamento;
			configuracao.Manutencao = dados.Manutencao;
			configuracao.MotivoManutencao = dados.Manutencao
				? dados.MotivoManutencao
				: null;
			configuracao.DataAtualizacao = DateTime.Now;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Configurações da sala salvas com sucesso.",
				configuracao
			});
		}

		// GET consultar permissões da sala
		[Authorize]
		[HttpGet("{id}/permissoes")]
		public async Task<IActionResult> ConsultarPermissoes(int id)
		{
			var sala = await _context.Salas
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			var permissao = await _context.PermissoesSalas
				.AsNoTracking()
				.FirstOrDefaultAsync(p => p.SalaId == id);

			if (permissao == null)
			{
				permissao = new PermissaoSala
				{
					SalaId = id,
					Professor = true,
					Gestor = true,
					PermitirReservas = true,
					AcessoRestrito = false
				};
			}

			return Ok(permissao);
		}

		// PUT cadastrar ou atualizar permissões da sala
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}/permissoes")]
		public async Task<IActionResult> SalvarPermissoes(
			int id,
			[FromBody] PermissaoSalaRequest dados)
		{
			var sala = await _context.Salas.FindAsync(id);

			if (sala == null)
				return NotFound("Sala não encontrada.");

			var permissao = await _context.PermissoesSalas
				.FirstOrDefaultAsync(p => p.SalaId == id);

			if (permissao == null)
			{
				permissao = new PermissaoSala
				{
					SalaId = id
				};

				_context.PermissoesSalas.Add(permissao);
			}

			permissao.Professor = dados.Professor;
			permissao.Gestor = dados.Gestor;
			permissao.PermitirReservas = dados.PermitirReservas;
			permissao.AcessoRestrito = dados.AcessoRestrito;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Permissões da sala salvas com sucesso.",
				permissao
			});
		}
	}
}
