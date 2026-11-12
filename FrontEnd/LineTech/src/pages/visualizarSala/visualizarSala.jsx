import React from 'react';
import { useNavigate } from 'react-router-dom';
import './visualizarSalaStyle.css';

export default function VisualizarSala() {
  const navigate = useNavigate();

  return (
    <div className="visualizar-sala-page dashboard-container">

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
          <div className="menu-item active" onClick={() => navigate('/consultar')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/door.png" alt="Salas" />
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
            <h1 className="page-title" style={{ margin: 0 }}>Sala 1.34 (em uso)</h1>
          </div>

          <div className="status-card">

            {/* INFORMAÇÕES DA SALA */}
            <div className="room-details-header">
              <div className="room-icon-box">
                <img width="44" height="44" src="https://img.icons8.com/material-outlined/48/1b89a8/image.png" alt="Sala" />
              </div>

              <div className="room-info-content">
                <h2>Sala 1.34</h2>
                <div className="status-tag">
                  <span>Em uso</span>
                </div>

                <p className="subject-title">Aula de Desenvolvimento</p>
                <p className="prof-name">Prof. Carlos Silva</p>

                <div className="meta-info">
                  <div className="meta-item">
                    <img width="18" height="18" src="https://img.icons8.com/material-outlined/24/1b89a8/door.png" alt="Piso e Capacidade" />
                    Piso: 1º andar · Capacidade: 30 pessoas
                  </div>
                  <div className="meta-item">
                    <img width="18" height="18" src="https://img.icons8.com/material-outlined/24/1b89a8/time.png" alt="Horário" />
                    10:00 - 12:00
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS DE LIBERAÇÃO E BARRA DE PROGRESSO */}
            <div className="liberation-section">
              <h3>Status de liberação</h3>

              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>

              <div className="time-remaining-row">
                <span className="time-label">Tempo restante</span>
                <span className="time-value">1h 38min</span>
              </div>

              <button className="btn-detalhes-reserva" onClick={() => navigate('/detalhes')}>
                Ver detalhes da reserva
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}