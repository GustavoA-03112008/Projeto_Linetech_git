
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly LinetechContext _context;

		public AuthController(LinetechContext context)
		{
			_context = context;
		}

		// CADASTRO DE USUÁRIO
		[HttpPost("cadastro")]
		public async Task<IActionResult> Cadastrar(
			[FromBody] CadastrarUsuarioRequest dados)
		{
			if (string.IsNullOrWhiteSpace(dados.Nome) ||
				string.IsNullOrWhiteSpace(dados.Email) ||
				string.IsNullOrWhiteSpace(dados.Senha))
			{
				return BadRequest(new
				{
					mensagem = "Preencha nome, e-mail e senha."
				});
			}

			string email = dados.Email.Trim().ToLowerInvariant();

			bool emailExiste = await _context.Usuarios
				.AnyAsync(u => u.Email == email);

			if (emailExiste)
			{
				return Conflict(new
				{
					mensagem = "Este e-mail já está cadastrado."
				});
			}

			byte[] salt = RandomNumberGenerator.GetBytes(16);

			byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
				dados.Senha,
				salt,
				600000,
				HashAlgorithmName.SHA256,
				32);

			string senhaHash =
				$"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";

			var usuario = new Usuario
			{
				Nome = dados.Nome.Trim(),
				Email = email,
				SenhaHash = senhaHash,
				Ativo = true,
				DataCriacao = DateTime.UtcNow
			};

			_context.Usuarios.Add(usuario);
			await _context.SaveChangesAsync();

			return Created(
				$"/api/usuarios/{usuario.Id}",
				new
				{
					usuario.Id,
					usuario.Nome,
					usuario.Email,
					mensagem = "Usuário cadastrado com sucesso."
				});
		}

		// LOGIN DE USUÁRIO
		[HttpPost("login")]
		public async Task<IActionResult> Login(
			[FromBody] LoginRequest dados)
		{
			if (string.IsNullOrWhiteSpace(dados.Email) ||
				string.IsNullOrWhiteSpace(dados.Senha))
			{
				return BadRequest(new
				{
					mensagem = "Informe o e-mail e a senha."
				});
			}

			string email = dados.Email.Trim().ToLowerInvariant();

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Email == email);

			if (usuario == null || !usuario.Ativo)
			{
				return Unauthorized(new
				{
					mensagem = "E-mail ou senha inválidos."
				});
			}

			string[] partes = usuario.SenhaHash.Split('.');

			if (partes.Length != 2)
			{
				return Unauthorized(new
				{
					mensagem = "E-mail ou senha inválidos."
				});
			}

			byte[] salt;
			byte[] hashArmazenado;

			try
			{
				salt = Convert.FromBase64String(partes[0]);
				hashArmazenado = Convert.FromBase64String(partes[1]);
			}
			catch (FormatException)
			{
				return Unauthorized(new
				{
					mensagem = "E-mail ou senha inválidos."
				});
			}

			byte[] hashInformado = Rfc2898DeriveBytes.Pbkdf2(
				dados.Senha,
				salt,
				600000,
				HashAlgorithmName.SHA256,
				hashArmazenado.Length);

			if (!CryptographicOperations.FixedTimeEquals(
				hashInformado, hashArmazenado))
			{
				return Unauthorized(new
				{
					mensagem = "E-mail ou senha inválidos."
				});
			}

			return Ok(new
			{
				mensagem = "Login realizado com sucesso.",
				usuario = new
				{
					usuario.Id,
					usuario.Nome,
					usuario.Email
				}
			});
		}
	}
}
