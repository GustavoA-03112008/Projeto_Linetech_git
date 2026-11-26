
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../inicio/inicioStyle.css';
import './notificacoesStyle.css';

const NOTIFICACOES_INICIAIS = [
  {
    id: 1,
    titulo: 'Reserva aprovada',
    mensagem: 'Sua reserva para o Laboratório de Informática (Sala 1.34) foi aprovada.',
    tempo: 'Há 10 min',
    lida: false,
    rota: '/historico'
  },
  {
    id: 2,
    titulo: 'Nova solicitação de sala',
    mensagem: 'Prof. Ana solicitou acesso à Sala 1.34 para amanhã no período da manhã.',
    tempo: 'Há 1 hora',
    lida: false,
    rota: '/solicitacoes'
  },
  {
    id: 3,
    titulo: 'Manutenção concluída',
    mensagem: 'O projetor da Sala 2.10 já está disponível para uso novamente.',
    tempo: 'Ontem às 16:40',
    lida: true,
    rota: '/consultar'
  },
  {
    id: 4,
    titulo: 'Lembrete de aula',
    mensagem: 'Você possui uma reserva confirmada hoje às 19:00 na Sala 1.12.',
    tempo: 'Há 2 dias',
    lida: true,
    rota: '/historico'
  }
];

export default function Notificacoes() {
  const navigate = useNavigate();

  const [termoBusca, setTermoBusca] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_INICIAIS);

  // Busca os dados do usuário conectado
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nomeUsuario = usuario.nome || usuario.Nome || 'Usuário';

  // Quantidade de notificações não lidas
  const naoLidasCount = notificacoes.filter(
    (item) => !item.lida
  ).length;

  // Filtra notificações por situação e pesquisa
  const notificacoesFiltradas = notificacoes.filter((item) => {
    const correspondeFiltro =
      filtro === 'nao-lidas' ? !item.lida : true;

    const termo = termoBusca.trim().toLowerCase();

    const correspondeBusca =
      termo === '' ||
      item.titulo.toLowerCase().includes(termo) ||
      item.mensagem.toLowerCase().includes(termo);

    return correspondeFiltro && correspondeBusca;
  });

  // Marca uma notificação como lida
  function marcarComoLida(id) {
    setNotificacoes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lida: true } : item
      )
    );
  }

  // Marca todas as notificações como lidas
  function marcarTodasComoLidas() {
    setNotificacoes((prev) =>
      prev.map((item) => ({ ...item, lida: true }))
    );
  }

  // Remove uma notificação
  function removerNotificacao(e, id) {
    e.stopPropagation();

    setNotificacoes((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  // Abre o destino da notificação
  function handleAbrirNotificacao(item) {
    marcarComoLida(item.id);

    if (item.rota) {
      navigate(item.rota);
    }
  }

  return (
    <div className="notificacoes-page dashboard-container">

      {/* BARRA LATERAL */}
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
            className="menu-item"
            onClick={() => navigate('/consultar')}
          >
            <img
              className="menu-icon"
              width="22"
              height="22"
              src="https://img.icons8.com/material-outlined/24/688596/door.png"
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
              placeholder="Buscar notificações..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <div className="topbar-actions">

            <div
              className="profile-section"
              onClick={() => navigate('/perfil')}
              style={{ cursor: 'pointer' }}
            >
              <img
                width="28"
                height="28"
                src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png"
                alt="Usuário"
              />

              {nomeUsuario}

              <span style={{ fontSize: '9px', marginLeft: '3px' }}>
                ▼
              </span>
            </div>

          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">

          <div className="notificacoes-header">
            <div>
              <h1 className="welcome-title">Notificações</h1>

              <p className="welcome-subtitle">
                Acompanhe avisos sobre suas reservas, salas e solicitações.
              </p>
            </div>

            {naoLidasCount > 0 && (
              <button
                type="button"
                className="btn-marcar-todas"
                onClick={marcarTodasComoLidas}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* ABAS DE FILTRO */}
          <div className="notificacoes-filtros">

            <button
              type="button"
              className={`filtro-tab ${filtro === 'todas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              Todas ({notificacoes.length})
            </button>

            <button
              type="button"
              className={`filtro-tab ${filtro === 'nao-lidas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('nao-lidas')}
            >
              Não lidas ({naoLidasCount})
            </button>

          </div>

          {/* LISTA DE NOTIFICAÇÕES */}
          <div className="reservas-list">

            {notificacoesFiltradas.length === 0 ? (
              <p>
                {termoBusca.trim() !== ''
                  ? 'Nenhuma notificação encontrada para sua pesquisa.'
                  : filtro === 'nao-lidas'
                    ? 'Você não possui notificações não lidas.'
                    : 'Você ainda não possui notificações.'}
              </p>
            ) : (

              notificacoesFiltradas.map((item) => (
                <div
                  className={`reserva-item notificacao-item ${
                    !item.lida ? 'nao-lida' : ''
                  }`}
                  key={item.id}
                  onClick={() => handleAbrirNotificacao(item)}
                  style={{ cursor: 'pointer' }}
                >

                  <div className="reserva-info-left">

                    <div className="reserva-icon-bg">
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders--v1.png"
                        alt="Notificação"
                      />
                    </div>

                    <div className="reserva-text">

                      <h4>
                        {item.titulo}

                        {!item.lida && (
                          <span className="notificacao-badge-nova">
                            Nova
                          </span>
                        )}
                      </h4>

                      <p>
                        {item.mensagem}

                        <br />

                        <span className="notificacao-tempo">
                          {item.tempo}
                        </span>
                      </p>

                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remover-notificacao"
                    title="Remover notificação"
                    aria-label={`Remover notificação: ${item.titulo}`}
                    onClick={(e) => removerNotificacao(e, item.id)}
                  >
                    ✕
                  </button>

                </div>
              ))

            )}

          </div>

        </div>
      </main>
    </div>
  );
}
