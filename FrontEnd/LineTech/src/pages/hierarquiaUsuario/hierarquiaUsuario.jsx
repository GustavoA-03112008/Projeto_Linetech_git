import React from 'react';
import { useNavigate } from 'react-router-dom';
import './hierarquiaUsuarioStyle.css';

const niveisAcesso = [
  {
    cargo: 'Administrador',
    descricao: 'Acesso total ao sistema.',
  },
  {
    cargo: 'Professor',
    descricao: 'Reserva salas permitidas e solicita acesso às restritas.',
  }
];

export default function HierarquiaUsuario() {
  const navigate = useNavigate();

  return (
    <div className="hierarquia-usuario-page dashboard-container">

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
            <h1 className="page-title" style={{ margin: 0 }}>Hierarquia de Usuários</h1>
          </div>

          <div className="hierarchy-list">
            {niveisAcesso.map((nivel, index) => (
              <div className="hierarchy-item" key={index}>
                <div className="user-icon-box">
                  <img width="26" height="26" src="https://img.icons8.com/material-outlined/28/1b89a8/user--v1.png" alt="Usuário" />
                </div>
                <div className="user-info">
                  <h2>{nivel.cargo}</h2>
                  <p>{nivel.descricao}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}