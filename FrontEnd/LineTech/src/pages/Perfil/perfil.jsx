import React from 'react';
import { useNavigate } from 'react-router-dom';
import './perfilStyle.css';

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="perfil-page dashboard-container">
      
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '20px', 
            width: '100%', 
            justifyContent: 'flex-start',
            alignSelf: 'flex-start' 
          }}>
            <img 
              width="24" 
              height="24" 
              src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png" 
              alt="Voltar" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)} 
            />
            <h1 className="page-title" style={{ margin: 0 }}>Perfil</h1>
          </div>

          {/* CABEÇALHO DO PERFIL */}
          <div className="profile-header">
            <div className="profile-avatar-box">
              <img width="54" height="54" src="https://img.icons8.com/material-outlined/60/1b89a8/user--v1.png" alt="Avatar" />
            </div>
            <h1 className="profile-name">Prof. Carlos</h1>
            <p className="profile-role">Professor</p>
          </div>

          {/* LISTA DE OPÇÕES */}
          <div className="profile-menu-list">
            
            <div className="profile-menu-item" onClick={() => navigate('/historico')}>
              <div className="menu-item-left">
                <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Minhas reservas" />
                <span>Minhas reservas</span>
              </div>
              <span className="menu-item-arrow">{'>'}</span>
            </div>

            <div className="profile-menu-item" onClick={() => navigate('/solicitacoes')}>
              <div className="menu-item-left">
                <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/document--v1.png" alt="Solicitações de acesso" />
                <span>Solicitações de acesso</span>
              </div>
              <span className="menu-item-arrow">{'>'}</span>
            </div>

            <div className="profile-menu-item" onClick={() => navigate('/configuracoes')}>
              <div className="menu-item-left">
                <img width="22" height="22" src="https://img.icons8.com/ios-glyphs/30/1b89a8/pencil--v1.png" alt="Editar Perfil" />
                <span>Editar Perfil</span>
              </div>
              <span className="menu-item-arrow">{'>'}</span>
            </div>

            <div className="profile-menu-item" onClick={() => navigate('/hierarquia')}>
              <div className="menu-item-left">
                <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/conference-call.png" alt="Hierarquia de Usuários" />
                <span>Hierarquia de Usuários</span>
              </div>
              <span className="menu-item-arrow">{'>'}</span>
            </div>

            <div className="profile-menu-item" onClick={() => navigate('/')}>
              <div className="menu-item-left">
                <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/logout-rounded-left.png" alt="Sair" />
                <span>Sair</span>
              </div>
              <span className="menu-item-arrow">{'>'}</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}