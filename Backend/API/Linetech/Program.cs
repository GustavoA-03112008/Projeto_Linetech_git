
using Microsoft.EntityFrameworkCore;
using Linetech.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// CONFIGURAÇÃO DO SWAGGER COM JWT
builder.Services.AddSwaggerGen(options =>
{
	options.AddSecurityDefinition(
		"Bearer",
		new Microsoft.OpenApi.OpenApiSecurityScheme
		{
			Name = "Authorization",
			Type = Microsoft.OpenApi.SecuritySchemeType.Http,
			Scheme = "bearer",
			BearerFormat = "JWT",
			In = Microsoft.OpenApi.ParameterLocation.Header,
			Description = "Informe o token JWT."
		});

	options.AddSecurityRequirement(document =>
		new Microsoft.OpenApi.OpenApiSecurityRequirement
		{
			[
				new Microsoft.OpenApi.OpenApiSecuritySchemeReference(
					"Bearer", document)
			] = new List<string>()
		});
});

// CONEXÃO COM O BANCO DE DADOS
builder.Services.AddDbContext<LinetechContext>(options =>
	options.UseSqlServer(
		builder.Configuration.GetConnectionString("ConexaoLinetech")));

// CONFIGURAÇÃO JWT
var chaveJwt = builder.Configuration["Jwt:Key"]
	?? throw new InvalidOperationException(
		"Chave JWT não configurada.");

builder.Services.AddAuthentication(
	JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters =
			new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,

				ValidIssuer =
					builder.Configuration["Jwt:Issuer"],

				ValidAudience =
					builder.Configuration["Jwt:Audience"],

				IssuerSigningKey = new SymmetricSecurityKey(
					Encoding.UTF8.GetBytes(chaveJwt))
			};
	});

var app = builder.Build();

// CONFIGURAÇÃO DA INTERFACE SWAGGER
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// AUTENTICAÇÃO E AUTORIZAÇÃO
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
