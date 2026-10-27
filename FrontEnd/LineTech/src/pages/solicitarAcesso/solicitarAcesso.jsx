import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './solicitarAcessoStyle.css';

export default function SolicitarAcesso() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pendentes');

  return (
    <div className="solicitar-acesso-page dashboard-container">
      
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
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/document--v1.png" alt="Solicitações" />
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
          <h1 className="page-title">Solicitação de acesso</h1>

          {/* ABAS DE NAVEGAÇÃO */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'pendentes' ? 'active' : ''}`}
              onClick={() => setActiveTab('pendentes')}
            >
              Pendentes (2)
            </button>
            <button 
              className={`tab-button ${activeTab === 'aprovadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('aprovadas')}
            >
              Aprovadas
            </button>
            <button 
              className={`tab-button ${activeTab === 'recusadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('recusadas')}
            >
              Recusadas
            </button>
          </div>

          {/* LISTA DE SOLICITAÇÕES */}
          <div className="requests-list">
            
            {/* CARTÃO 1: Sala de reunião */}
            <div className="request-card-item">
              <div className="request-card-header">
                <div className="request-image-placeholder">
                  <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/image.png" alt="Imagem" />
                </div>
                <div className="request-details-info">
                  <h3>Sala de reunião</h3>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/user.png" alt="Professor" />
                    Prof. Carlos Silva
                  </div>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Data" />
                    10/10/2026 - 10:00 - 12:00
                  </div>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/user-group-man-man.png" alt="Motivo" />
                    Reunião de equipe
                  </div>
                </div>
                <div className="arrow-link" onClick={() => navigate('/detalhes')}>
                  {'>'}
                </div>
              </div>

              <div className="card-action-buttons">
                <button className="btn-aprovar">
                  <span>✓</span> Aprovar
                </button>
                <button className="btn-recusar">
                  <span>✕</span> Recusar
                </button>
              </div>
            </div>

            {/* CARTÃO 2: Laboratório de informática */}
            <div className="request-card-item">
              <div className="request-card-header">
                <div className="request-image-placeholder">
                  <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/image.png" alt="Imagem" />
                </div>
                <div className="request-details-info">
                  <h3>Laboratório de informática</h3>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/user.png" alt="Professor" />
                    Prof. Ana Sousa
                  </div>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Data" />
                    11/10/2026 - 10:00 - 12:00
                  </div>
                  <div className="info-row">
                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/1b89a8/user-group-man-man.png" alt="Motivo" />
                    Aula prática
                  </div>
                </div>
                <div className="arrow-link" onClick={() => navigate('/detalhes')}>
                  {'>'}
                </div>
              </div>

              <div className="card-action-buttons">
                <button className="btn-aprovar">
                  <span>✓</span> Aprovar
                </button>
                <button className="btn-recusar">
                  <span>✕</span> Recusar
                </button>
              </div>
            </div>

          </div>

          {/* BOTÃO ENTRAR & FOOTER */}
          <button className="btn-entrar-footer" onClick={() => navigate('/')}>
            <img width="20" height="20" src="https://img.icons8.com/material-outlined/24/ffffff/door.png" alt="Entrar" />
            Entrar
          </button>

          <p className="account-footer-text">
            Não tem uma conta? <span onClick={() => navigate('/detalhes')}>Solicitar acesso</span>
          </p>

        </div>
      </main>
    </div>
  );
}