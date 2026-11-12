
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './consultarDisponibilidadeStyle.css';

function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export default function ConsultarDisponibilidade() {
  const navigate = useNavigate();

  // Estados das salas
  const [salas, setSalas] = useState([]);
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroBusca, setErroBusca] = useState('');
  const [buscouDisponibilidade, setBuscouDisponibilidade] = useState(false);

  // Estados dos filtros
  const [data, setData] = useState(obterDataAtual());
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFim, setHoraFim] = useState('12:00');

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
        setErro(error.message || 'Não foi possível carregar as salas.');
      } finally {
        setCarregando(false);
      }
    }

    carregarSalas();
  }, []);

  // Busca a disponibilidade das salas no período selecionado
  async function buscarDisponibilidade() {
    setErroBusca('');
    setSalasDisponiveis([]);
    setBuscouDisponibilidade(false);

    if (!data || !horaInicio || !horaFim) {
      setErroBusca('Preencha a data e os horários.');
      return;
    }

    if (horaFim <= horaInicio) {
      setErroBusca('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    const salasAtivas = salas.filter(
      sala => sala.disponivel ?? sala.Disponivel
    );

    if (salasAtivas.length === 0) {
      setErroBusca('Não existem salas marcadas como disponíveis.');
      return;
    }

    try {
      setBuscando(true);

      const dataInicio = `${data}T${horaInicio}:00`;
      const dataFim = `${data}T${horaFim}:00`;

      const resultados = await Promise.all(
        salasAtivas.map(async sala => {
          const id = sala.id ?? sala.Id;

          const resposta = await apiRequest(
            `/api/Salas/${id}/disponibilidade?dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}`
          );

          return {
            sala,
            disponivel: resposta?.disponivel ?? resposta?.Disponivel
          };
        })
      );

      const disponiveis = resultados
        .filter(resultado => resultado.disponivel === true)
        .map(resultado => resultado.sala);

      setSalasDisponiveis(disponiveis);
      setBuscouDisponibilidade(true);

    } catch (error) {
      console.error('Erro ao consultar disponibilidade:', error);
      setErroBusca(
        error.message || 'Não foi possível consultar a disponibilidade das salas.'
      );
    } finally {
      setBuscando(false);
    }
  }

  // Define quais salas serão exibidas
  const salasExibidas = buscouDisponibilidade
    ? salasDisponiveis
    : salas.filter(sala => sala.disponivel ?? sala.Disponivel);

  return (
    <div className="consultar-disponibilidade-page dashboard-container">

      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="sidebar-menu">

          <div className="menu-item" onClick={() => navigate('/inicio')}>
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/home--v2.png"
              alt="Início"
            />
            Início
          </div>

          <div className="menu-item" onClick={() => navigate('/historico')}>
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

          <div className="menu-item" onClick={() => navigate('/solicitacoes')}>
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/document--v1.png"
              alt="Solicitações"
            />
            Solicitações
          </div>

          <div className="menu-item" onClick={() => navigate('/perfil')}>
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

        {/* BARRA SUPERIOR */}
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

          {/* TÍTULO */}
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
                  type="date"
                  className="form-input"
                  value={data}
                  onChange={e => setData(e.target.value)}
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
                  <input
                    type="time"
                    className="form-input"
                    value={horaInicio}
                    onChange={e => setHoraInicio(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Até</label>

                <div className="form-input-wrapper">
                  <input
                    type="time"
                    className="form-input"
                    value={horaFim}
                    onChange={e => setHoraFim(e.target.value)}
                  />
                </div>
              </div>

            </div>

            <div className="form-group">
              <label className="form-label">Tipo de sala</label>

              <div className="form-input-wrapper">
                <select className="form-input" disabled>
                  <option>Todos os tipos</option>
                </select>

                <span style={{ color: '#26a5ca', fontSize: '12px' }}>
                  ▼
                </span>
              </div>
            </div>

            <button
              className="btn-buscar"
              type="button"
              onClick={buscarDisponibilidade}
              disabled={buscando || carregando}
            >
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/material-outlined/24/ffffff/search--v1.png"
                alt="Buscar"
              />

              {buscando ? 'Buscando...' : 'Buscar'}
            </button>

          </div>

          {/* RESULTADOS */}
          <h2 className="section-subtitle">
            Salas disponíveis
          </h2>

          <div className="room-list">

            {carregando && <p>Carregando salas...</p>}

            {erro && (
              <p style={{ color: '#d32f2f' }}>
                {erro}
              </p>
            )}

            {erroBusca && (
              <p style={{ color: '#d32f2f' }}>
                {erroBusca}
              </p>
            )}

            {buscando && (
              <p>Consultando disponibilidade das salas...</p>
            )}

            {!carregando && !erro && !erroBusca && !buscando &&
              salasExibidas.length === 0 && (
                <p>
                  {buscouDisponibilidade
                    ? 'Nenhuma sala está disponível para o período selecionado.'
                    : salas.length === 0
                      ? 'Nenhuma sala cadastrada.'
                      : 'Nenhuma sala está marcada como disponível.'}
                </p>
              )}

            {!carregando && !erro && !erroBusca && !buscando &&
              salasExibidas.map(sala => (
                <div
                  className="room-card"
                  key={sala.id ?? sala.Id}
                  onClick={() => navigate('/detalhes', {
                    state: { salaId: sala.id ?? sala.Id }
                  })}
                  style={{ cursor: 'pointer' }}
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
                    Disponível
                  </div>

                </div>
              ))}

          </div>

        </div>
      </main>
    </div>
  );
}
