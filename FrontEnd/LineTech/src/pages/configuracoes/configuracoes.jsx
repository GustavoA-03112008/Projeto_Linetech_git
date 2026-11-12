import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './configuracoesStyle.css';

export default function Configuracoes() {
  const navigate = useNavigate();

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  return (
    <div className="configuracoes-page dashboard-container">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="sidebar">
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/inicio')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/home--v2.png" alt="Início" />
            Início
          </div>
          <div className="menu-item" onClick={() => navigate('/historico')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/calendar--v1.png" alt="Reservas" />
            Reservas
          </div>
          <div className="menu-item" onClick={() => navigate('/consultar')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/door.png" alt="Salas" />
            Salas
          </div>
          <div className="menu-item" onClick={() => navigate('/solicitacoes')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/document--v1.png" alt="Solicitações" />
            Solicitações
          </div>
          <div className="menu-item active" onClick={() => navigate('/perfil')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/user--v1.png" alt="Perfil" />
            Perfil
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">
        
        {/* BARRA SUPERIOR (TOPBAR) */}
        <header className="topbar">
          <div className="search-container">
            <img width="20" height="20" src="https://img.icons8.com/material-outlined/24/1b89a8/search--v1.png" alt="Buscar" />
            <input type="text" className="search-input" placeholder="Buscar salas, atividades..." />
          </div>
          
          <div className="topbar-actions">
           <div className="notification-icon" onClick={() => navigate('/notificacoes')}>
            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />
            </div>
            <div className="profile-section" onClick={() => navigate('/perfil')}>
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              Prof. Carlos <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
            </div>
          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">
          
          {/* TÍTULO COM BOTÃO VOLTAR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img 
              width="24" 
              height="24" 
              src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png" 
              alt="Voltar" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)} 
            />
            <h1 className="page-title" style={{ margin: 0 }}>Editar Perfil</h1>
          </div>

          {/* DADOS PESSOAIS */}
          <h2 className="section-title">Dados pessoais</h2>

          <div className="form-group">
            <label className="form-label">Nome</label>
            <input type="text" className="form-input" defaultValue="Prof. Carlos Silva" />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-input" defaultValue="carlos@senai.edu.br" />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input type="text" className="form-input" defaultValue="(11) 98765-4321" />
          </div>

          {/* ALTERAR SENHA */}
          <h2 className="section-title">Alterar senha</h2>

          <div className="form-group">
            <div className="input-password-wrapper">
              <input 
                type={showSenhaAtual ? "text" : "password"} 
                className="form-input" 
                placeholder="Senha atual" 
              />
              <img 
                className="password-toggle-icon" 
                width="20" 
                height="20" 
                src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png" 
                alt="Mostrar senha" 
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-password-wrapper">
              <input 
                type={showNovaSenha ? "text" : "password"} 
                className="form-input" 
                placeholder="Nova senha" 
              />
              <img 
                className="password-toggle-icon" 
                width="20" 
                height="20" 
                src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png" 
                alt="Mostrar senha" 
                onClick={() => setShowNovaSenha(!showNovaSenha)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-password-wrapper">
              <input 
                type={showConfirmarSenha ? "text" : "password"} 
                className="form-input" 
                placeholder="Confirmar nova senha" 
              />
              <img 
                className="password-toggle-icon" 
                width="20" 
                height="20" 
                src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png" 
                alt="Mostrar senha" 
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              />
            </div>
          </div>

          <button className="btn-salvar-alteracoes">
            Salvar alterações
          </button>

        </div>
      </main>
    </div>
  );
}