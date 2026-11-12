import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './gestaoDeSalaStyle.css';

export default function GestaoDeSala() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informacoes');

  return (
    <div className="gestao-sala-page dashboard-container">
      
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
            <h1 className="page-title" style={{ margin: 0 }}>Gestão da sala</h1>
          </div>

          {/* CARTÃO CABEÇALHO DA SALA */}
          <div className="room-header-card">
            <div className="room-header-left">
              <div className="room-icon-box">
                <img width="40" height="40" src="https://img.icons8.com/material-outlined/48/1b89a8/image.png" alt="Sala" />
              </div>
              <div className="room-info-text">
                <h2>Sala 1.34</h2>
                <p>Sala de aula - Capacidade: 30</p>
              </div>
            </div>

            <div className="status-badge-active">
              Ativa
            </div>
          </div>

          {/* ABAS (Informações, Permissões, Configurações) */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'informacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('informacoes')}
            >
              Informações
            </button>
            <button 
              className={`tab-button ${activeTab === 'permissoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('permissoes')}
            >
              Permissões
            </button>
            <button 
              className={`tab-button ${activeTab === 'configuracoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('configuracoes')}
            >
              Configurações
            </button>
          </div>

          {/* CONTEÚDO PRINCIPAL DAS INFORMAÇÕES */}
          <div className="info-main-card">
            
            <div className="info-section">
              <h3>Equipamentos</h3>
              <ul className="check-list">
                <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Projetor</li>
                <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Computadores (20)</li>
                <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Ar-condicionado</li>
                <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Quadro branco</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>Quem pode usar esta sala</h3>
              <p className="light-text">Professores, Coordenação e Funcionários (conforme permissão)</p>
            </div>

            <div className="info-section">
              <h3>Horários disponíveis</h3>
              <div className="days-row">
                <span className="day-item">Seg</span>
                <span className="day-item">Ter</span>
                <span className="day-item">Qua</span>
                <span className="day-item">Qui</span>
                <span className="day-item">Sex</span>
              </div>
            </div>

            <button className="btn-salvar-alteracoes">
              Salvar alterações
            </button>

          </div>

        </div>
      </main>
    </div>
  );
}