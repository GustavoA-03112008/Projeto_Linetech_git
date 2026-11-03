import React from 'react';
import { useNavigate } from 'react-router-dom';
import './consultarDisponibilidadeStyle.css';

export default function ConsultarDisponibilidade() {
  const navigate = useNavigate();

  return (
    <div className="consultar-disponibilidade-page dashboard-container">
      
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
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar salas, atividades..." 
            />
          </div>
          
          <div className="topbar-actions">
            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />
            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/mail.png" alt="Mensagens" />
            <div className="profile-section" onClick={() => navigate('/perfil')}>
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              Prof. Carlos 
              <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
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
            <h1 className="page-title" style={{ margin: 0 }}>Consultar disponibilidade</h1>
          </div>

          {/* Cartão de Filtros */}
          <div className="filter-card">
            
            <div className="form-group">
              <label className="form-label">Data</label>
              <div className="form-input-wrapper">
                <input type="text" className="form-input" defaultValue="08/10/2026" />
                <img className="input-icon" width="20" height="20" src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png" alt="Calendário" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Horário</label>
                <div className="form-input-wrapper">
                  <select className="form-input">
                    <option>08:00</option>
                  </select>
                  <span style={{color: '#26a5ca', fontSize: '12px'}}>▼</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Até</label>
                <div className="form-input-wrapper">
                  <select className="form-input">
                    <option>12:00</option>
                  </select>
                  <span style={{color: '#26a5ca', fontSize: '12px'}}>▼</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de sala</label>
              <div className="form-input-wrapper">
                <select className="form-input">
                  <option>Todos os tipos</option>
                </select>
                <span style={{color: '#26a5ca', fontSize: '12px'}}>▼</span>
              </div>
            </div>

            <button className="btn-buscar">
              <img width="20" height="20" src="https://img.icons8.com/material-outlined/24/ffffff/search--v1.png" alt="Buscar" />
              Buscar
            </button>
          </div>

          {/* Resultados */}
          <h2 className="section-subtitle">Salas disponíveis</h2>
          
          <div className="room-list">
            {/* Sala 1.34 */}
            <div className="room-card">
              <div className="room-icon-bg">
                <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png" alt="Calendário" />
              </div>
              <div className="room-details">
                <div className="room-name-title">Sala 1.34</div>
                <div className="room-info-text">Capacidade: 30 pessoas</div>
                <div className="room-info-text">Projetor e ar-condicionado</div>
              </div>
              <div className="badge-disponivel">Disponível</div>
            </div>

            {/* Sala 2.01 */}
            <div className="room-card">
              <div className="room-icon-bg">
                <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png" alt="Calendário" />
              </div>
              <div className="room-details">
                <div className="room-name-title">Sala 2.01</div>
                <div className="room-info-text">Capacidade: 20 pessoas</div>
                <div className="room-info-text">Projetor</div>
              </div>
              <div className="badge-disponivel">Disponível</div>
            </div>

            {/* Sala 2.03 */}
            <div className="room-card">
              <div className="room-icon-bg">
                <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png" alt="Calendário" />
              </div>
              <div className="room-details">
                <div className="room-name-title">Sala 2.03</div>
                <div className="room-info-text">Capacidade: 50 pessoas</div>
                <div className="room-info-text">Auditório · ar-condicionado</div>
              </div>
              <div className="badge-disponivel">Disponível</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}