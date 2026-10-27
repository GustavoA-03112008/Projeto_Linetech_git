import React from 'react';
import { useNavigate } from 'react-router-dom';
import './inicioStyle.css';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-page dashboard-container">

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="sidebar">
        <div className="sidebar-menu">
          <div className="menu-item active">
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/home--v2.png" alt="Início" />
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
          <div className="menu-item" onClick={() => navigate('/perfil')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/user--v1.png" alt="Perfil" />
            Perfil
          </div>
        </div>
        <div className="sidebar-footer">
          Educação<br />que transforma
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
            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />
            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/mail.png" alt="Mensagens" />
            <div className="profile-section">
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              Prof. Carlos <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
            </div>
          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">
          <h1 className="welcome-title">Olá, João!</h1>
          <p className="welcome-subtitle">Aqui você pode gerenciar suas reservas e acessar as salas disponíveis.</p>

          {/* GRELHA DE AÇÕES */}
          <div className="action-grid">
            <div className="action-card" onClick={() => navigate('/gestao')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/calendar--v1.png" alt="Reservar sala" />
              <h3>Gestao de Sala</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/consultar')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/search--v1.png" alt="Consultar disponibilidade" />
              <h3>Consultar disponibilidade</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/historico')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/paste.png" alt="Gestão de salas" />
              <h3>Historico de Reservas</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/solicitacoes')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/user-group-man-man.png" alt="Solicitar acesso" />
              <h3>Solicitar acesso</h3>
            </div>
          </div>

          {/* PRÓXIMAS RESERVAS */}
          <div className="section-header">
            <h3>Próximas reservas</h3>
            <span className="link-ver-todas">Ver todas</span>
          </div>

          <div className="reservas-list">
            {/* Clique para /visualizar */}
            <div className="reserva-item" onClick={() => navigate('/visualizar')} style={{ cursor: 'pointer' }}>
              <div className="reserva-info-left">
                <div className="reserva-icon-bg">
                  <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Calendário" />
                </div>
                <div className="reserva-text">
                  <h4>Sala 1.34</h4>
                  <p>10:00 - 12:00, 03 de set.<br />Aula de Desenvolvimento</p>
                </div>
              </div>
              <div className="arrow-icon">{'>'}</div>
            </div>

            {/* Clique para /visualizar */}
            <div className="reserva-item" onClick={() => navigate('/visualizar')} style={{ cursor: 'pointer' }}>
              <div className="reserva-info-left">
                <div className="reserva-icon-bg">
                  <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Calendário" />
                </div>
                <div className="reserva-text">
                  <h4>Sala 2.10</h4>
                  <p>13:00 - 16:00, 03 de set.<br />Reunião de equipe</p>
                </div>
              </div>
              <div className="arrow-icon">{'>'}</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}