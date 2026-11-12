
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './consultarDisponibilidadeStyle.css';

export default function ConsultarDisponibilidade() {
  const navigate = useNavigate();

  // Estados das salas
  const [salas, setSalas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Carrega as salas cadastradas na API
  useEffect(() => {
    async function carregarSalas() {
      try {
        setCarregando(true);
        setErro('');

        const dados = await apiRequest('/api/Salas');

        setSalas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        setErro(
          error.message || 'Não foi possível carregar as salas.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarSalas();
  }, []);

  return (
    <div className="consultar-disponibilidade-page dashboard-container">

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="sidebar">
        <div className="sidebar-menu">

          <div
            className="menu-item"
            onClick={() => navigate('/inicio')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/home--v2.png"
              alt="Início"
            />
            Início
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/historico')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/calendar--v1.png"
              alt="Reservas"
            />
            Reservas
          </div>

          <div
            className="menu-item active"
            onClick={() => navigate('/consultar')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/1b89a8/door.png"
              alt="Salas"
            />
            Salas
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/solicitacoes')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/document--v1.png"
              alt="Solicitações"
            />
            Solicitações
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/perfil')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/user--v1.png"
              alt="Perfil"
            />
            Perfil
          </div>

        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">

        {/* BARRA SUPERIOR (TOPBAR) */}
        <header className="topbar">

          <div className="search-container">
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/material-outlined/24/1b89a8/search--v1.png"
              alt="Buscar"
            />

            <input
              type="text"
              className="search-input"
              placeholder="Buscar salas, atividades..."
            />
          </div>

          <div className="topbar-actions">

            <div
              className="notification-icon"
              onClick={() => navigate('/notificacoes')}
            >
              <img
                width="22"
                height="22"
                style={{ cursor: 'pointer' }}
                src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png"
                alt="Notificações"
              />
            </div>

            <div
              className="profile-section"
              onClick={() => navigate('/perfil')}
            >
              <img
                width="28"
                height="28"
                src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png"
                alt="Usuário"
              />

              {(() => {
                try {
                  const usuario = JSON.parse(
                    localStorage.getItem('usuario') || 'null'
                  );

                  return (
                    usuario?.nome ||
                    usuario?.Nome ||
                    usuario?.name ||
                    usuario?.Name ||
                    'Usuário'
                  );
                } catch {
                  return 'Usuário';
                }
              })()}

              <span style={{ fontSize: '9px', marginLeft: '3px' }}>
                ▼
              </span>
            </div>

          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">

          {/* TÍTULO COM BOTÃO VOLTAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png"
              alt="Voltar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            />

            <h1 className="page-title" style={{ margin: 0 }}>
              Consultar disponibilidade
            </h1>
          </div>

          {/* CARTÃO DE FILTROS */}
          <div className="filter-card">

            <div className="form-group">
              <label className="form-label">Data</label>

              <div className="form-input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  defaultValue="08/10/2026"
                />

                <img
                  className="input-icon"
                  width="20"
                  height="20"
                  src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png"
                  alt="Calendário"
                />
              </div>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label className="form-label">Horário</label>

                <div className="form-input-wrapper">
                  <select className="form-input">
                    <option>08:00</option>
                  </select>

                  <span style={{ color: '#26a5ca', fontSize: '12px' }}>
                    ▼
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Até</label>

                <div className="form-input-wrapper">
                  <select className="form-input">
                    <option>12:00</option>
                  </select>

                  <span style={{ color: '#26a5ca', fontSize: '12px' }}>
                    ▼
                  </span>
                </div>
              </div>

            </div>

            <div className="form-group">
              <label className="form-label">Tipo de sala</label>

              <div className="form-input-wrapper">
                <select className="form-input">
                  <option>Todos os tipos</option>
                </select>

                <span style={{ color: '#26a5ca', fontSize: '12px' }}>
                  ▼
                </span>
              </div>
            </div>

            <button className="btn-buscar" type="button">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/material-outlined/24/ffffff/search--v1.png"
                alt="Buscar"
              />
              Buscar
            </button>

          </div>

          {/* RESULTADOS */}
          <h2 className="section-subtitle">
            Salas disponíveis
          </h2>

          <div className="room-list">

            {/* Carregamento */}
            {carregando && (
              <p>Carregando salas...</p>
            )}

            {/* Mensagem de erro */}
            {erro && (
              <p style={{ color: '#d32f2f' }}>
                {erro}
              </p>
            )}

            {/* Nenhuma sala cadastrada */}
            {!carregando && !erro && salas.length === 0 && (
              <p>Nenhuma sala cadastrada.</p>
            )}

            {/* Lista de salas cadastradas */}
            {!carregando && !erro && salas
              .filter(sala => sala.disponivel ?? sala.Disponivel)
              .map(sala => (
                <div
                  className="room-card"
                  key={sala.id ?? sala.Id}
                >

                  <div className="room-icon-bg">
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/material-outlined/24/26a5ca/calendar--v1.png"
                      alt="Calendário"
                    />
                  </div>

                  <div className="room-details">

                    <div className="room-name-title">
                      {sala.nome ?? sala.Nome}
                    </div>

                    <div className="room-info-text">
                      Capacidade: {sala.capacidade ?? sala.Capacidade} pessoas
                    </div>

                  </div>

                  <div className="badge-disponivel">
                    Disponível para consulta
                  </div>

                </div>
              ))}

            {/* Existem salas, mas nenhuma está marcada como disponível */}
            {!carregando &&
              !erro &&
              salas.length > 0 &&
              !salas.some(sala => sala.disponivel ?? sala.Disponivel) && (
                <p>Nenhuma sala está marcada como disponível.</p>
              )}

          </div>

        </div>
      </main>
    </div>
  );
}
