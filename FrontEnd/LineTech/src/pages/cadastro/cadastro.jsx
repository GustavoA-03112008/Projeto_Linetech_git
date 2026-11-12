import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastroStyle.css";

function IconeIcons8({ tipo, visivel }) {
  const icones = {
    usuario: "https://img.icons8.com/ios-glyphs/30/1b89a8/user--v1.png",
    email: "https://img.icons8.com/ios-glyphs/30/1b89a8/filled-message.png",
    senha: "https://img.icons8.com/ios-glyphs/30/1b89a8/lock--v1.png",
    olhoAberto: "https://img.icons8.com/ios-glyphs/30/1b89a8/visible--v1.png",
    olhoFechado: "https://img.icons8.com/ios-glyphs/30/1b89a8/invisible.png",
  };

  if (tipo === "olho") {
    return (
      <img
        src={visivel ? icones.olhoAberto : icones.olhoFechado}
        alt={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="icone-icons8"
      />
    );
  }

  return (
    <img
      src={icones[tipo]}
      alt={`Ícone ${tipo}`}
      className="icone-icons8"
    />
  );
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleCadastro(e) {
    e.preventDefault();

    if (!usuario.trim() || !email.trim() || !senha.trim()) {
      alert("Preencha todos os campos!");
      return;
    }

    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  }

  function handleIrParaLogin() {
    navigate("/login");
  }

  return (
    <main className="cadastro-container">
      <section className="cadastro-card">
        {/* PARTE SUPERIOR - IDENTIDADE VISUAL */}
        <div className="cadastro-apresentacao">
          <img
            src="/logo-senai.png"
            alt="Logo SENAI"
            className="cadastro-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          <h1>SENAI</h1>
          <h2>Gestão de Salas</h2>

          <p>
            Organize, reserve e aproveite os espaços da sua unidade.
          </p>
        </div>

        {/* PARTE INFERIOR - FORMULÁRIO */}
        <div className="cadastro-form-area">
          <form onSubmit={handleCadastro}>
            <div className="cadastro-titulo">
              <h2>Crie sua conta</h2>
              <p>Preencha os dados abaixo para se cadastrar.</p>
            </div>

            <div className="cadastro-input">
              <IconeIcons8 tipo="usuario" />
              <input
                type="text"
                placeholder="Nome de usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="cadastro-input">
              <IconeIcons8 tipo="email" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="cadastro-input">
              <IconeIcons8 tipo="senha" />
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="cadastro-olho"
                onClick={() => setMostrarSenha((prev) => !prev)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <IconeIcons8 tipo="olho" visivel={mostrarSenha} />
              </button>
            </div>

            <button type="submit" className="cadastro-botao">
              Cadastrar
            </button>

            <div className="cadastro-login">
              <span>Já tem uma conta?</span>
              <button
                type="button"
                className="cadastro-btn-entrar"
                onClick={handleIrParaLogin}
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}