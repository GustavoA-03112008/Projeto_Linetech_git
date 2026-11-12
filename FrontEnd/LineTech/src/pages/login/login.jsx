
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginStyle.css';
import logoImg from '../../assets/logo.png';
import { apiRequest } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Realiza o login
  async function handleLogin(e) {
    e.preventDefault();
    setErro('');

    if (!email.trim() || !senha.trim()) {
      setErro('Informe o e-mail e a senha.');
      return;
    }

    try {
      setCarregando(true);

      const resposta = await apiRequest('/api/Login/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          senha: senha
        })
      });

      if (!resposta?.token) {
        throw new Error('A API não retornou o token de acesso.');
      }

      if (!resposta?.usuario) {
        throw new Error('A API não retornou os dados do usuário.');
      }

      // Salva o token JWT
      localStorage.setItem('token', resposta.token);

      // Salva os dados do usuário
      localStorage.setItem(
        'usuario',
        JSON.stringify(resposta.usuario)
      );

      // Redireciona após autenticação
      navigate('/inicio');

    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">

      {/* Formas geométricas de fundo */}
      <div className="bg-shape-top-left"></div>
      <div className="bg-shape-bottom-right"></div>

      {/* Conteúdo Central */}
      <div className="content-wrapper">

        <img
          src={logoImg}
          alt="Logótipo Central"
          className="main-logo"
        />

        <h1 className="senai-text">SENAI</h1>
        <h2 className="welcome-text">Bem-vindo(a)</h2>
        <h3 className="system-text">Gestão de Salas</h3>

        <p className="description-text">
          Organize, reserve e aproveite os<br />
          espaços da sua unidade.
        </p>

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} style={{ width: '100%' }}>

          {/* Campo de E-mail */}
          <div className="input-group">
            <div className="input-wrapper">

              <span
                className="input-icon"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/material-rounded/24/1b89a8/user.png"
                  alt="Login"
                />
              </span>

              <input
                className="input-field"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />

            </div>
          </div>

          {/* Campo de Senha */}
          <div className="input-group">
            <div className="input-wrapper">

              <span
                className="input-icon"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/material-rounded/24/1b89a8/lock.png"
                  alt="Senha"
                  style={{ opacity: 0.6 }}
                />
              </span>

              <input
                className="input-field"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />

              {/* Mostrar ou ocultar senha */}
              <span
                className="input-icon icon-pointer"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                {mostrarSenha ? (
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/material-rounded/24/visible.png"
                    alt="Ocultar"
                    style={{ opacity: 0.6 }}
                  />
                ) : (
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/material-rounded/24/invisible.png"
                    alt="Mostrar"
                    style={{ opacity: 0.6 }}
                  />
                )}
              </span>

            </div>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <p
              style={{
                color: '#d32f2f',
                fontSize: '14px',
                marginTop: '8px',
                textAlign: 'center'
              }}
            >
              {erro}
            </p>
          )}

          {/* Botão Entrar */}
          <button
            className="login-button"
            type="submit"
            disabled={carregando}
          >
            <span>→</span>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        {/* Links inferiores */}
        <div className="links-container">

          <span className="forgot-password">
            Esqueceu sua senha?
            <a
              href="/esqueceu-senha"
              className="request-access"
            >
              {' '}Clique aqui
            </a>
          </span>

          <span className="no-account">
            Não tem uma conta?{' '}
            <a
              href="/solicitar-acesso"
              className="request-access"
            >
              Solicitar acesso
            </a>
          </span>

        </div>

      </div>

      {/* Rodapé */}
      <div className="login-footer">
        SENAI · Educação profissional para um futuro melhor
      </div>

    </div>
  );
}
