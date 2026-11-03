import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importação direta do ficheiro CSS
import './loginStyle.css'; 
import logoImg from '../../assets/logo.png'; 

export default function Login() {
  const navigate = useNavigate();
  // Adicionado o estado para controlar a visibilidade da senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  return (
    <div className="login-container">
      {/* Formas geométricas de fundo do desktop */}
      <div className="bg-shape-top-left"></div>
      <div className="bg-shape-bottom-right"></div>
      
      {/* Conteúdo Central */}
      <div className="content-wrapper">
        
        <img src={logoImg} alt="Logótipo Central" className="main-logo" />
        <h1 className="senai-text">SENAI</h1>
        <h2 className="welcome-text">Bem-vindo(a)</h2>
        <h3 className="system-text">Gestão de Salas</h3>
        <p className="description-text">
          Organize, reserve e aproveite os<br/>espaços da sua unidade.
        </p>

        {/* Campo de Utilizador */}
        <div className="input-group">
          <div className="input-wrapper">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/1b89a8/user.png" alt="Login"/>
            </span>
            <input className="input-field" type="text" placeholder="Usuário" />
          </div>
        </div>

        {/* Campo de Palavra-passe */}
        <div className="input-group">
          <div className="input-wrapper">
            {/* Ícone de Cadeado do Icons8 atualizado aqui */}
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/1b89a8/lock.png" alt="Senha" style={{ opacity: 0.6 }}/>
            </span>
            
            {/* O type muda dependendo do estado */}
            <input 
              className="input-field" 
              type={mostrarSenha ? "text" : "password"} 
              placeholder="Senha" 
            />
            
            {/* O onClick inverte o estado quando clicado */}
            <span 
              className="input-icon icon-pointer" 
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              {mostrarSenha ? (
                <img width="24" height="24" src="https://img.icons8.com/material-rounded/24//visible.png" alt="Ocultar" style={{ opacity: 0.6 }}/>
              ) : (
                <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/invisible.png" alt="Mostrar" style={{ opacity: 0.6 }}/>
              )}
            </span>
          </div>
        </div>

        {/* Botão Entrar */}
        <button className="login-button" onClick={() => navigate('/inicio')}>
          <span>→</span> Entrar
        </button>

        {/* Links inferiores */}
        <div className="links-container">
          <span className="forgot-password">Esqueceu sua senha?</span>
          <span className="no-account">
            Não tem uma conta? <a href="/solicitar-acesso" className="request-access">Solicitar acesso</a>
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