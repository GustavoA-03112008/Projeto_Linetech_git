
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginStyle.css';
import logoImg from '../../assets/logo.png';
import { apiRequest } from '../../services/api.js';

export default function Login() {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function realizarLogin(event) {
    event.preventDefault();

    setErro('');

    if (!email.trim() || !senha) {
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

      // SALVAR TOKEN E DADOS DO USUÁRIO
      localStorage.setItem('token', resposta.token);
      localStorage.setItem(
        'usuario',
        JSON.stringify(resposta.usuario)
      );

      // DIRECIONAR PARA A PÁGINA INICIAL
      navigate('/inicio');

    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">

      <div className="bg-shape-top-left"></div>
      <div className="bg-shape-bottom-right"></div>

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

        <form onSubmit={realizarLogin}>

          {/* CAMPO DE E-MAIL */}
          <div className="input-group">
            <div className="input-wrapper">

              <span
                className="input-icon"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/material-rounded/24/1b89a8/user.png"
                  alt="E-mail"
                />
              </span>

              <input
                className="input-field"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />

            </div>
          </div>

          {/* CAMPO DE SENHA */}
          <div className="input-group">
            <div className="input-wrapper">

              <span
                className="input-icon"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
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
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                required
              />

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

          {/* MENSAGEM DE ERRO */}
          {erro && (
            <p
              role="alert"
              style={{
                color: '#d32f2f',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '10px'
              }}
            >
              {erro}
            </p>
          )}

          {/* BOTÃO ENTRAR */}
          <button
            className="login-button"
            type="submit"
            disabled={carregando}
          >
            <span>→</span>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        {/* LINKS INFERIORES */}
        <div className="links-container">

          <span className="forgot-password">
            Esqueceu sua senha?
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

      {/* RODAPÉ */}
      <div className="login-footer">
        SENAI · Educação profissional para um futuro melhor
      </div>

    </div>
  );
}
