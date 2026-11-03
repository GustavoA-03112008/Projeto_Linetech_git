import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './historicoReservaStyle.css';

const reservas = [
  {
    id: 1,
    sala: 'Sala 1.34',
    dataHora: '08/10/2026 - 08:00 - 10:00',
    atividade: 'Aula de Desenvolvimento',
    categoria: 'Salas',
  },
  {
    id: 2,
    sala: 'Sala de reunião',
    dataHora: '06/10/2026 - 14:00 - 16:00',
    atividade: 'Reunião de equipe',
    categoria: 'Minhas',
  },
  {
    id: 3,
    sala: 'Lab. Informática',
    dataHora: '01/10/2026 - 10:00 - 12:00',
    atividade: 'Aula Prática',
    categoria: 'Outros',
  },
  {
    id: 4,
    sala: 'Sala 1.35',
    dataHora: '28/09/2026 - 15:00 - 17:00',
    atividade: 'Sala de Estudos',
    categoria: 'Salas',
  },
];

export default function HistoricoReserva() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('Todas');

  const listaFiltrada = reservas.filter((reserva) => {
    if (filtro === 'Minhas') {
      return reserva.categoria === 'Minhas' || reserva.id === 1;
    }
    if (filtro === 'Salas') {
      return reserva.sala.toLowerCase().includes('sala');
    }
    return true;
  });

  return (
    <div className="historico-reserva-page dashboard-container">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="sidebar">
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/inicio')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/home--v2.png" alt="Início" />
            Início
          </div>
          <div className="menu-item active" onClick={() => navigate('/historico')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Reservas" />
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
            <h1 className="page-title" style={{ margin: 0 }}>Histórico das reservas</h1>
          </div>

          {/* ABAS DE FILTRO */}
          <div className="tabs-container">
            {['Todas', 'Minhas', 'Salas'].map((aba) => (
              <button
                key={aba}
                type="button"
                className={`tab-button ${filtro === aba ? 'active' : ''}`}
                onClick={() => setFiltro(aba)}
              >
                {aba}
              </button>
            ))}
          </div>

          {/* LISTA DE RESERVAS */}
          <div className="reservas-list">
            {listaFiltrada.map((item) => (
              <div 
                className="reserva-card-item" 
                key={item.id}
                onClick={() => navigate('/detalhes')}
              >
                <div className="reserva-card-left">
                  <div className="reserva-icon-box">
                    <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Calendário" />
                  </div>
                  <div className="reserva-card-info">
                    <h2>{item.sala}</h2>
                    <p className="reserva-data">{item.dataHora}</p>
                    <p className="reserva-atividade">{item.atividade}</p>
                  </div>
                </div>

                <div className="arrow-icon">{'>'}</div>
              </div>
            ))}

            {listaFiltrada.length === 0 && (
              <div className="empty-message">
                Nenhuma reserva encontrada.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}