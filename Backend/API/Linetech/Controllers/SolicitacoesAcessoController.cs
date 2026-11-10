
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Linetech.Data;
using Linetech.Models;
using System.Security.Claims;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SolicitacoesAcessoController : ControllerBase
	{
		private readonly LinetechContext _context;

		public SolicitacoesAcessoController(LinetechContext context)
		{
			_context = context;
		}

		// GET: api/SolicitacoesAcesso
		// Lista todas as solicitações
		[HttpGet]
		public async Task<ActionResult<IEnumerable<SolicitacaoAcesso>>> GetSolicitacoes()
		{
			var solicitacoes = await _context.SolicitacoesAcesso
				.AsNoTracking()
				.ToListAsync();

			return Ok(solicitacoes);
		}

		// GET: api/SolicitacoesAcesso/1
		// Consulta uma solicitação específica
		[HttpGet("{id}")]
		public async Task<ActionResult<SolicitacaoAcesso>> GetSolicitacao(int id)
		{
			var solicitacao = await _context.SolicitacoesAcesso
				.AsNoTracking()
				.FirstOrDefaultAsync(s => s.Id == id);

			if (solicitacao == null)
			{
				return NotFound(new
				{
					mensagem = "Solicitação não encontrada."
				});
			}

			return Ok(solicitacao);
		}

		// POST: api/SolicitacoesAcesso
		// Registra uma solicitação de acesso
		[HttpPost]
		public async Task<ActionResult<SolicitacaoAcesso>> CriarSolicitacao(
			[FromBody] SolicitacaoAcesso solicitacao)
		{
			if (solicitacao.UsuarioId <= 0)
			{
				return BadRequest(new
				{
					mensagem = "Informe um usuário válido."
				});
			}

			var usuarioExiste = await _context.Usuarios
				.AnyAsync(u => u.Id == solicitacao.UsuarioId);

			if (!usuarioExiste)
			{
				return BadRequest(new
				{
					mensagem = "Usuário não encontrado."
				});
			}

			var funcoesPermitidas = new[]
			{
				"ReservarSalas",
				"GerenciarRecursos"
			};

			if (!funcoesPermitidas.Contains(solicitacao.Funcao))
			{
				return BadRequest(new
				{
					mensagem = "Função inválida."
				});
			}

			solicitacao.Id = 0;
			solicitacao.Status = "Pendente";
			solicitacao.DataSolicitacao = DateTime.Now;
			solicitacao.GestorId = null;
			solicitacao.DataDecisao = null;
			solicitacao.Observacao = null;

			_context.SolicitacoesAcesso.Add(solicitacao);
			await _context.SaveChangesAsync();

			return CreatedAtAction(
				nameof(GetSolicitacao),
				new { id = solicitacao.Id },
				solicitacao);
		}

		// PUT: api/SolicitacoesAcesso/1/decisao
		// Somente gestores autenticados podem decidir
		[Authorize(Roles = "Gestor")]
		[HttpPut("{id}/decisao")]
		public async Task<IActionResult> DecidirSolicitacao(
			int id,
			[FromBody] DecisaoSolicitacao dados)
		{
			// Obtém o ID do gestor autenticado pelo token JWT
			var idUsuario = User.FindFirstValue(
				ClaimTypes.NameIdentifier);

			if (!int.TryParse(idUsuario, out int gestorId))
			{
				return Unauthorized(new
				{
					mensagem = "Não foi possível identificar o gestor autenticado."
				});
			}

			var gestor = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == gestorId);

			if (gestor == null ||
				!gestor.Ativo ||
				gestor.Perfil != "Gestor")
			{
				return Forbid();
			}

			var solicitacao = await _context.SolicitacoesAcesso
				.FirstOrDefaultAsync(s => s.Id == id);

			if (solicitacao == null)
			{
				return NotFound(new
				{
					mensagem = "Solicitação não encontrada."
				});
			}

			if (solicitacao.Status != "Pendente")
			{
				return BadRequest(new
				{
					mensagem = "Esta solicitação já foi decidida."
				});
			}

			if (dados.Status != "Aprovada" &&
				dados.Status != "Recusada")
			{
				return BadRequest(new
				{
					mensagem = "Informe Aprovada ou Recusada."
				});
			}

			solicitacao.Status = dados.Status;
			solicitacao.GestorId = gestor.Id;
			solicitacao.DataDecisao = DateTime.Now;
			solicitacao.Observacao = dados.Observacao;

			await _context.SaveChangesAsync();

			return Ok(solicitacao);
		}
	}

	// Dados enviados na decisão
	public class DecisaoSolicitacao
	{
		public string Status { get; set; } = string.Empty;

		public string? Observacao { get; set; }
	}
}
