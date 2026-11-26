
using Linetech.Data;
using Linetech.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Linetech.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class LoginController : ControllerBase
	{
		private readonly LinetechContext _context;
		private readonly IConfiguration _configuration;

		public LoginController(
			LinetechContext context,
			IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		// MÉTODO PARA CRIAR A SENHA COM HASH
		private static string GerarSenhaHash(string senha)
		{
			byte[] salt = RandomNumberGenerator.GetBytes(16);

			byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
				senha,
				salt,
				600000,
				HashAlgorithmName.SHA256,
				32);

			return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
		}

		// MÉTODO PARA VERIFICAR A SENHA
		private static bool VerificarSenha(string senha, string senhaHash)
		{
			string[] partes = senhaHash.Split('.');

			if (partes.Length != 2)
				return false;

			try
			{
				byte[] salt = Convert.FromBase64String(partes[0]);
				byte[] hashArmazenado = Convert.FromBase64String(partes[1]);

				byte[] hashInformado = Rfc2898DeriveBytes.Pbkdf2(
					senha,
					salt,
					600000,
					HashAlgorithmName.SHA256,
					hashArmazenado.Length);

				return CryptographicOperations.FixedTimeEquals(
					hashInformado,
					hashArmazenado);
			}
			catch (FormatException)
			{
				return false;
			}
		}

		// CADASTRO PÚBLICO DE PROFESSOR
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

			var usuario = new Usuario
			{
				Nome = dados.Nome.Trim(),
				Email = email,
				SenhaHash = GerarSenhaHash(dados.Senha),
				Perfil = "Professor",
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
					usuario.Perfil,
					mensagem = "Professor cadastrado com sucesso."
				});
		}

		// CADASTRO DE GESTOR - SOMENTE GESTOR AUTENTICADO
		[Authorize(Roles = "Gestor")]
		[HttpPost("cadastro-gestor")]
		public async Task<IActionResult> CadastrarGestor(
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

			var usuario = new Usuario
			{
				Nome = dados.Nome.Trim(),
				Email = email,
				SenhaHash = GerarSenhaHash(dados.Senha),
				Perfil = "Gestor",
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
					usuario.Perfil,
					mensagem = "Gestor cadastrado com sucesso."
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

			// GERAÇÃO DO TOKEN JWT
			var claims = new[]
			{
				new Claim(
					ClaimTypes.NameIdentifier,
					usuario.Id.ToString()),

				new Claim(ClaimTypes.Name, usuario.Nome),

				new Claim(ClaimTypes.Email, usuario.Email),

				new Claim(ClaimTypes.Role, usuario.Perfil)
			};

			var chave = _configuration["Jwt:Key"]
				?? throw new InvalidOperationException(
					"Chave JWT não configurada.");

			var credenciais = new SigningCredentials(
				new SymmetricSecurityKey(
					Encoding.UTF8.GetBytes(chave)),
				SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddHours(2),
				signingCredentials: credenciais);

			return Ok(new
			{
				mensagem = "Login realizado com sucesso.",

				token = new JwtSecurityTokenHandler()
					.WriteToken(token),

				usuario = new
				{
					usuario.Id,
					usuario.Nome,
					usuario.Email,
					usuario.Perfil
				}
			});
		}

		// EDITAR PERFIL DO USUÁRIO LOGADO
		[Authorize]
		[HttpPut("perfil")]
		public async Task<IActionResult> EditarPerfil(
			[FromBody] EditarPerfilRequest dados)
		{
			if (!int.TryParse(
				User.FindFirstValue(ClaimTypes.NameIdentifier),
				out int usuarioId))
			{
				return Unauthorized(new
				{
					mensagem = "Usuário não identificado."
				});
			}

			if (string.IsNullOrWhiteSpace(dados.Nome) ||
				string.IsNullOrWhiteSpace(dados.Email))
			{
				return BadRequest(new
				{
					mensagem = "Preencha o nome e o e-mail."
				});
			}

			var usuario = await _context.Usuarios
				.FirstOrDefaultAsync(u => u.Id == usuarioId && u.Ativo);

			if (usuario == null)
			{
				return NotFound(new
				{
					mensagem = "Usuário não encontrado."
				});
			}

			string email = dados.Email.Trim().ToLowerInvariant();

			bool emailExiste = await _context.Usuarios.AnyAsync(u =>
				u.Email == email && u.Id != usuarioId);

			if (emailExiste)
			{
				return Conflict(new
				{
					mensagem = "Este e-mail já está cadastrado."
				});
			}

			if (!VerificarSenha(dados.SenhaAtual, usuario.SenhaHash))
			{
				return BadRequest(new
				{
					mensagem = "A senha atual está incorreta."
				});
			}

			if (!string.IsNullOrWhiteSpace(dados.NovaSenha))
			{
				if (dados.NovaSenha.Length < 6)
				{
					return BadRequest(new
					{
						mensagem = "A nova senha deve ter pelo menos 6 caracteres."
					});
				}

				usuario.SenhaHash = GerarSenhaHash(dados.NovaSenha);
			}

			usuario.Nome = dados.Nome.Trim();
			usuario.Email = email;

			await _context.SaveChangesAsync();

			return Ok(new
			{
				mensagem = "Perfil atualizado com sucesso.",
				usuario = new
				{
					usuario.Id,
					usuario.Nome,
					usuario.Email,
					usuario.Perfil
				}
			});
		}
	}
}
