import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./notificacoesStyle.css";

const notificacoesIniciais = [
  {
    id: 1,
    titulo: "Reserva Aprovada",
    mensagem: "A sua solicitação para o Laboratório de Informática 02 foi aprovada.",
    horario: "Há 10 min",
    lida: false,
    tipo: "sucesso",
  },
  {
    id: 2,
    titulo: "Lembrete de Reserva",
    mensagem: "Sua reserva do Auditório Principal começa em 30 minutos.",
    horario: "Há 1 hora",
    lida: false,
    tipo: "alerta",
  },
  {
    id: 3,
    titulo: "Solicitação Pendente",
    mensagem: "Você possui 1 nova solicitação de acesso para analisar.",
    horario: "Há 3 horas",
    lida: true,
    tipo: "info",
  },
  {
    id: 4,
    titulo: "Manutenção Agendada",
    mensagem: "A Sala de Reuniões 01 estará indisponível amanhã das 14h às 18h.",
    horario: "Ontem",
    lida: true,
    tipo: "aviso",
  },
];

function IconeIcons8({ tipo }) {
  const icones = {
    sucesso: "https://img.icons8.com/material-outlined/24/1b89a8/ok--v1.png",
    alerta: "https://img.icons8.com/material-outlined/24/1b89a8/time--v1.png",
    info: "https://img.icons8.com/material-outlined/24/1b89a8/info.png",
    aviso: "https://img.icons8.com/material-outlined/24/1b89a8/warning-shield.png",
    lixeira: "https://img.icons8.com/material-outlined/24/1b89a8/trash.png",
    check: "https://img.icons8.com/material-outlined/24/1b89a8/double-tick.png",
  };

  return (
    <img
      src={icones[tipo] || icones.info}
      alt={tipo}
      width="20"
      height="20"
    />
  );
}

export default function Notificacoes() {
  const navigate = useNavigate();

  // Recupera o nome do usuário igualzinho ao Início
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const nomeUsuario =
    usuario?.nome ||
    usuario?.Nome ||
    usuario?.name ||
    usuario?.Name ||
    'Usuário';

  const [lista, setLista] = useState(notificacoesIniciais);
  const [filtro, setFiltro] = useState("todas");

  function marcarComoLida(id) {
    setLista((prev) =>
      prev.map((item) => (item.id === id ? { ...item, lida: true } : item))
    );
  }

  function marcarTodasComoLidas() {
    setLista((prev) => prev.map((item) => ({ ...item, lida: true })));
  }

  function removerNotificacao(id) {
    setLista((prev) => prev.filter((item) => item.id !== id));
  }

  const notificacoesFiltradas = lista.filter((item) => {
    if (filtro === "nao_lidas") return !item.lida;
    return true;
  });

  const totalNaoLidas = lista.filter((item) => !item.lida).length;

  return (
    <div className="inicio-page dashboard-container">

      {/* BARRA LATERAL (IDÊNTICA AO INÍCIO) */}
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

          <div className="menu-item" onClick={() => navigate('/perfil')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/688596/user--v1.png" alt="Perfil" />
            Perfil
          </div>

        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">

        {/* BARRA SUPERIOR (IDÊNTICA AO INÍCIO) */}
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

            <img
              width="22"
              height="22"
              style={{ cursor: 'pointer' }}
              src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png"
              alt="Notificações"
              onClick={() => navigate('/notificacoes')}
            />

            <img
              width="22"
              height="22"
              style={{ cursor: 'pointer' }}
              src="https://img.icons8.com/material-outlined/24/1b89a8/mail.png"
              alt="Mensagens"
            />

            <div className="profile-section" onClick={() => navigate('/perfil')}>
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              {nomeUsuario}
              <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
            </div>

          </div>
        </header>

        {/* CONTEÚDO DAS NOTIFICAÇÕES */}
        <div className="dashboard-content">
          <div className="notificacoes-card">
            
            {/* CABEÇALHO DA CAIXA */}
            <div className="notificacoes-header">
              <div className="notificacoes-titulo">
                <button
                  type="button"
                  className="btn-voltar-icone"
                  onClick={() => navigate(-1)}
                  title="Voltar"
                >
                  ‹
                </button>
                <h2>Notificações</h2>
                {totalNaoLidas > 0 && (
                  <span className="badge-nao-lidas">{totalNaoLidas} novas</span>
                )}
              </div>

              {totalNaoLidas > 0 && (
                <button
                  type="button"
                  className="btn-marcar-todas"
                  onClick={marcarTodasComoLidas}
                >
                  <IconeIcons8 tipo="check" />
                  <span>Ler todas</span>
                </button>
              )}
            </div>

            {/* ABAS */}
            <div className="notificacoes-abas">
              <button
                type="button"
                className={`aba-btn ${filtro === "todas" ? "ativa" : ""}`}
                onClick={() => setFiltro("todas")}
              >
                Todas ({lista.length})
              </button>
              <button
                type="button"
                className={`aba-btn ${filtro === "nao_lidas" ? "ativa" : ""}`}
                onClick={() => setFiltro("nao_lidas")}
              >
                Não lidas ({totalNaoLidas})
              </button>
            </div>

            {/* LISTA DE NOTIFICAÇÕES */}
            <div className="notificacoes-lista">
              {notificacoesFiltradas.length > 0 ? (
                notificacoesFiltradas.map((item) => (
                  <div
                    key={item.id}
                    className={`notificacao-item ${!item.lida ? "nao-lida" : ""}`}
                    onClick={() => marcarComoLida(item.id)}
                  >
                    <div className="notificacao-icone">
                      <IconeIcons8 tipo={item.tipo} />
                    </div>

                    <div className="notificacao-conteudo">
                      <div className="notificacao-topo">
                        <h4>{item.titulo}</h4>
                        <span className="notificacao-horario">{item.horario}</span>
                      </div>
                      <p>{item.mensagem}</p>
                    </div>

                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={(e) => {
                        e.stopPropagation();
                        removerNotificacao(item.id);
                      }}
                      title="Excluir notificação"
                    >
                      <IconeIcons8 tipo="lixeira" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="notificacoes-vazio">
                  <p>Nenhuma notificação encontrada.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}