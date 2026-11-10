
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import './inicioStyle.css';

export default function Inicio() {
  const navigate = useNavigate();

  // Estados das reservas
  const [reservas, setReservas] = useState([]);
  const [carregandoReservas, setCarregandoReservas] = useState(true);
  const [erroReservas, setErroReservas] = useState('');

  // Estados da pesquisa de salas
  const [termoBusca, setTermoBusca] = useState('');
  const [salas, setSalas] = useState([]);
  const [carregandoSalas, setCarregandoSalas] = useState(false);
  const [erroSalas, setErroSalas] = useState('');

  // Filtra as salas pelo nome digitado
  const salasFiltradas = salas.filter((sala) =>
    (sala.nome || '')
      .toLowerCase()
      .includes(termoBusca.trim().toLowerCase())
  );

  // Recupera os dados do usuário que realizou o login
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  // Identifica o nome do usuário
  const nomeUsuario =
    usuario?.nome ||
    usuario?.Nome ||
    usuario?.name ||
    usuario?.Name ||
    'Usuário';

  // Busca as próximas reservas na API
  useEffect(() => {
    async function carregarReservas() {
      try {
        setCarregandoReservas(true);
        setErroReservas('');

        const dados = await apiRequest(
          '/api/Reservas/minhas/proximas'
        );

        setReservas(Array.isArray(dados) ? dados : []);
      } catch (erro) {
        setErroReservas(
          erro.message || 'Não foi possível carregar as reservas.'
        );
      } finally {
        setCarregandoReservas(false);
      }
    }

    carregarReservas();
  }, []);

  // Busca todas as salas na API
  useEffect(() => {
    async function carregarSalas() {
      try {
        setCarregandoSalas(true);
        setErroSalas('');

        const dados = await apiRequest('/api/Salas');

        setSalas(Array.isArray(dados) ? dados : []);
      } catch (erro) {
        setErroSalas(
          erro.message || 'Não foi possível carregar as salas.'
        );
      } finally {
        setCarregandoSalas(false);
      }
    }

    carregarSalas();
  }, []);

  // Formata a data e o horário da reserva
  function formatarDataHora(data) {
    const dataReserva = new Date(data);

    return dataReserva.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="inicio-page dashboard-container">

      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="sidebar-menu">

          <div className="menu-item active" onClick={() => navigate('/inicio')}>
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
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">

        {/* BARRA SUPERIOR */}
        <header className="topbar">

          <div className="search-container">
            <img width="20" height="20" src="https://img.icons8.com/material-outlined/24/1b89a8/search--v1.png" alt="Buscar" />

            <input
              type="text"
              className="search-input"
              placeholder="Buscar salas, atividades..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <div className="topbar-actions">

            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />

            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/mail.png" alt="Mensagens" />

            <div className="profile-section" onClick={() => navigate('/perfil')}>
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              {nomeUsuario}
              <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
            </div>

          </div>
        </header>

        {/* RESULTADOS DA PESQUISA */}
        {termoBusca.trim() !== '' && (
          <div className="resultados-pesquisa">
            <h3>Salas encontradas</h3>

            {carregandoSalas && (
              <p>Buscando salas...</p>
            )}

            {!carregandoSalas && erroSalas && (
              <p>{erroSalas}</p>
            )}

            {!carregandoSalas &&
              !erroSalas &&
              salasFiltradas.length === 0 && (
                <p>Nenhuma sala encontrada.</p>
              )}

            {!carregandoSalas &&
              !erroSalas &&
              salasFiltradas.map((sala) => (
                <div className="resultado-sala" key={sala.id}>
                  <strong>{sala.nome}</strong>
                  <p>Capacidade: {sala.capacidade} pessoa(s)</p>
                  <p>
                    {sala.disponivel
                      ? 'Disponível'
                      : 'Indisponível'}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">

          <h1 className="welcome-title">
            Olá, {nomeUsuario}!
          </h1>

          <p className="welcome-subtitle">
            Aqui você pode gerenciar suas reservas e acessar as salas disponíveis.
          </p>

          {/* GRELHA DE AÇÕES */}
          <div className="action-grid">

            <div className="action-card" onClick={() => navigate('/gestao')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/calendar--v1.png" alt="Reservar sala" />
              <h3>Gestão de Sala</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/consultar')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/search--v1.png" alt="Consultar disponibilidade" />
              <h3>Consultar disponibilidade</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/historico')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/paste.png" alt="Gestão de salas" />
              <h3>Histórico de Reservas</h3>
            </div>

            <div className="action-card" onClick={() => navigate('/solicitacoes')}>
              <img width="36" height="36" src="https://img.icons8.com/material-outlined/48/1b89a8/user-group-man-man.png" alt="Solicitar acesso" />
              <h3>Solicitar acesso</h3>
            </div>

          </div>

          {/* PRÓXIMAS RESERVAS */}
          <div className="section-header">

            <h3>Próximas reservas</h3>

            <span
              className="link-ver-todas"
              onClick={() => navigate('/historico')}
              style={{ cursor: 'pointer' }}
            >
              Ver todas
            </span>

          </div>

          <div className="reservas-list">

            {carregandoReservas && (
              <p>Carregando próximas reservas...</p>
            )}

            {!carregandoReservas && erroReservas && (
              <p>{erroReservas}</p>
            )}

            {!carregandoReservas &&
              !erroReservas &&
              reservas.length === 0 && (
                <p>Você não possui próximas reservas.</p>
              )}

            {!carregandoReservas &&
              !erroReservas &&
              reservas.map((reserva) => (
                <div
                  className="reserva-item"
                  key={reserva.id}
                  onClick={() => navigate('/visualizar')}
                  style={{ cursor: 'pointer' }}
                >

                  <div className="reserva-info-left">

                    <div className="reserva-icon-bg">
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png"
                        alt="Calendário"
                      />
                    </div>

                    <div className="reserva-text">

                      <h4>{reserva.nomeSala}</h4>

                      <p>
                        {formatarDataHora(reserva.dataInicio)}
                        {' - '}
                        {new Date(reserva.dataFim).toLocaleTimeString(
                          'pt-BR',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                        <br />
                        {reserva.finalidade}
                      </p>

                    </div>
                  </div>

                  <div className="arrow-icon">{'>'}</div>

                </div>
              ))}

          </div>
        </div>
      </main>
    </div>
  );
}
