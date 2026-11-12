import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './esqueceuSenhaStyle.css';
import logoImg from '../../assets/logo.png';

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleEnviar(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnviado(true);
  }

  return (
    <div className="login-container">
      {/* Formas geométricas de fundo idênticas ao Login */}
      <div className="bg-shape-top-left"></div>
      <div className="bg-shape-bottom-right"></div>

      {/* Conteúdo Central */}
      <div className="content-wrapper">
        <img src={logoImg} alt="Logótipo Central" className="main-logo" />
        <h1 className="senai-text">SENAI</h1>

        {!enviado ? (
          <>
            <h2 className="welcome-text">Recuperar Senha</h2>
            <p className="description-text">
              Informe seu e-mail institucional ou usuário para receber as instruções de redefinição.
            </p>

            <form onSubmit={handleEnviar} style={{ width: '100%' }}>
              {/* Campo de E-mail / Usuário */}
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/material-rounded/24/1b89a8/mail.png"
                      alt="E-mail"
                    />
                  </span>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="E-mail ou Usuário"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Botão Enviar */}
              <button type="submit" className="login-button">
                <span>→</span> Enviar link de recuperação
              </button>
            </form>
          </>
        ) : (
          /* Estado de Confirmação após envio */
          <div className="enviado-box">
            <div className="enviado-icone">
              <img
                width="36"
                height="36"
                src="https://img.icons8.com/material-rounded/48/1b89a8/checkmark--v1.png"
                alt="Enviado"
              />
            </div>
            <h2 className="welcome-text" style={{ fontSize: '26px' }}>E-mail enviado!</h2>
            <p className="description-text" style={{ marginBottom: '25px' }}>
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada ou spam.
            </p>
            <button
              type="button"
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Voltar para o Login
            </button>
          </div>
        )}

        {/* Link inferior para voltar */}
        {!enviado && (
          <div className="links-container">
            <span
              className="forgot-password"
              onClick={() => navigate('/login')}
            >
              Voltar para o Login
            </span>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="login-footer">
        SENAI · Educação profissional para um futuro melhor
      </div>
    </div>
  );
}