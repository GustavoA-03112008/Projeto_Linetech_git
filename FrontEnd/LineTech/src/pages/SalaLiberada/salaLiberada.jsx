import React from 'react';
import { useNavigate } from 'react-router-dom';
import './salaLiberadaStyle.css';

export default function SalaLiberada() {
  const navigate = useNavigate();

  return (
    <div className="sala-liberada-page dashboard-container">

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
        <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)' }}>

          {/* BOTÃO VOLTAR NO CANTO SUPERIOR ESQUERDO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            width: '100%'
          }}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png"
              alt="Voltar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            />
            <h1 className="page-title" style={{ margin: 0 }}>Liberação de Sala</h1>
          </div>

          {/* CARD DE SUCESSO CENTRALIZADO */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            flex: 1
          }}>
            <div className="success-container" style={{ maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* ÍCONE DE SUCESSO */}
              <div className="check-circle" style={{ marginBottom: '16px' }}>
                <img src="https://img.icons8.com/material-outlined/48/00a8cc/checkmark.png" alt="Sucesso" />
              </div>

              <h1 className="success-title">Sala liberada</h1>

              <p className="success-message">
                A reserva foi encerrada e a sala já está disponível para novas reservas.
              </p>

              <button
                className="btn-ver-disponibilidades"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => navigate('/consultar')}
              >
                Ver disponibilidades
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}