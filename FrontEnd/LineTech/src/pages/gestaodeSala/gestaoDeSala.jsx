
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './gestaoDeSalaStyle.css';

export default function GestaoDeSala() {
  const navigate = useNavigate();

  // Controle das abas
  const [activeTab, setActiveTab] = useState('informacoes');

  // Estados das salas
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [carregandoSalas, setCarregandoSalas] = useState(true);
  const [erroSalas, setErroSalas] = useState('');

  // Estados dos recursos associados à sala
  const [recursos, setRecursos] = useState([]);
  const [carregandoRecursos, setCarregandoRecursos] = useState(false);
  const [erroRecursos, setErroRecursos] = useState('');

  // Estados de todos os recursos cadastrados
  const [todosRecursos, setTodosRecursos] = useState([]);
  const [carregandoTodosRecursos, setCarregandoTodosRecursos] = useState(false);

  // Estados do modal
  const [modalRecursosAberto, setModalRecursosAberto] = useState(false);
  const [recursoSelecionado, setRecursoSelecionado] = useState('');
  const [quantidadeRecurso, setQuantidadeRecurso] = useState('1');
  const [salvandoRecurso, setSalvandoRecurso] = useState(false);
  const [mensagemRecurso, setMensagemRecurso] = useState('');
  const [erroModal, setErroModal] = useState('');

  // Estados para operações nos recursos
  const [removendoRecurso, setRemovendoRecurso] = useState(null);
  const [alterandoQuantidade, setAlterandoQuantidade] = useState(null);

  // =====================================
  // CARREGAR SALAS DA API
  // =====================================

  useEffect(() => {
    async function carregarSalas() {
      try {
        setCarregandoSalas(true);
        setErroSalas('');

        const dados = await apiRequest('/api/Salas');
        const lista = Array.isArray(dados) ? dados : [];

        setSalas(lista);

        if (lista.length > 0) {
          setSalaSelecionada(
            String(lista[0].id ?? lista[0].Id)
          );
        } else {
          setSalaSelecionada('');
        }
      } catch (erro) {
        console.error('Erro ao carregar salas:', erro);
        setErroSalas(
          erro.message || 'Não foi possível carregar as salas.'
        );
      } finally {
        setCarregandoSalas(false);
      }
    }

    carregarSalas();
  }, []);

  // =====================================
  // CARREGAR TODOS OS RECURSOS CADASTRADOS
  // =====================================

  useEffect(() => {
    async function carregarTodosRecursos() {
      try {
        setCarregandoTodosRecursos(true);

        const dados = await apiRequest('/api/Recursos');

        setTodosRecursos(
          Array.isArray(dados) ? dados : []
        );
      } catch (erro) {
        console.error('Erro ao carregar todos os recursos:', erro);
      } finally {
        setCarregandoTodosRecursos(false);
      }
    }

    carregarTodosRecursos();
  }, []);

  // =====================================
  // FILTRAR SALAS PELA PESQUISA
  // =====================================

  const salasFiltradas = salas.filter((sala) => {
    const nome = String(
      sala.nome ?? sala.Nome ?? ''
    ).toLowerCase();

    return nome.includes(
      termoBusca.trim().toLowerCase()
    );
  });

  // =====================================
  // IDENTIFICAR SALA SELECIONADA
  // =====================================

  const salaAtual = salas.find(
    (sala) =>
      String(sala.id ?? sala.Id) === salaSelecionada
  );

  const nomeSala =
    salaAtual?.nome ?? salaAtual?.Nome ?? '';

  const capacidade =
    salaAtual?.capacidade ?? salaAtual?.Capacidade ?? 0;

  const disponivel =
    salaAtual?.disponivel ?? salaAtual?.Disponivel ?? false;

  // =====================================
  // SELECIONAR SALA
  // =====================================

  function selecionarSala(sala) {
    setSalaSelecionada(
      String(sala.id ?? sala.Id)
    );

    setTermoBusca('');
    setMensagemRecurso('');
    setErroModal('');
  }

  // =====================================
  // CARREGAR RECURSOS DA SALA
  // =====================================

  async function carregarRecursosDaSala() {
    if (!salaSelecionada) {
      setRecursos([]);
      return;
    }

    try {
      setCarregandoRecursos(true);
      setErroRecursos('');

      const dados = await apiRequest(
        `/api/Salas/${salaSelecionada}/recursos`
      );

      setRecursos(
        Array.isArray(dados) ? dados : []
      );
    } catch (erro) {
      console.error('Erro ao carregar recursos:', erro);

      setErroRecursos(
        'Não foi possível carregar os recursos da sala.'
      );

      setRecursos([]);
    } finally {
      setCarregandoRecursos(false);
    }
  }

  useEffect(() => {
    carregarRecursosDaSala();
  }, [salaSelecionada]);

  // =====================================
  // RECURSOS DISPONÍVEIS PARA ADICIONAR
  // =====================================

  const recursosDisponiveis = todosRecursos;

  // =====================================
  // ABRIR MODAL
  // =====================================

  function abrirModalRecursos() {
    setRecursoSelecionado('');
    setQuantidadeRecurso('1');
    setMensagemRecurso('');
    setErroModal('');
    setModalRecursosAberto(true);
  }

  // =====================================
  // FECHAR MODAL
  // =====================================

  function fecharModalRecursos() {
    if (salvandoRecurso) return;

    setModalRecursosAberto(false);
    setRecursoSelecionado('');
    setQuantidadeRecurso('1');
    setMensagemRecurso('');
    setErroModal('');
  }

  // =====================================
  // ADICIONAR RECURSO À SALA
  // =====================================

  async function adicionarRecurso() {
    const quantidade = Number(quantidadeRecurso);

    if (!salaSelecionada || !recursoSelecionado) {
      setErroModal('Selecione um recurso para adicionar.');
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      setErroModal(
        'Informe uma quantidade inteira maior que zero.'
      );
      return;
    }

    try {
      setSalvandoRecurso(true);
      setErroModal('');
      setMensagemRecurso('');

      await apiRequest(
        `/api/Salas/${salaSelecionada}/recursos/${recursoSelecionado}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(quantidade)
        }
      );

      await carregarRecursosDaSala();

      setMensagemRecurso(
        'Quantidade adicionada à sala com sucesso!'
      );

      setRecursoSelecionado('');
      setQuantidadeRecurso('1');

    } catch (erro) {
      console.error('Erro ao adicionar recurso:', erro);

      setErroModal(
        erro.message || 'Não foi possível adicionar o recurso.'
      );
    } finally {
      setSalvandoRecurso(false);
    }
  }

  // =====================================
  // DIMINUIR QUANTIDADE DO RECURSO
  // =====================================

  async function diminuirQuantidadeRecurso(recursoId) {
    const confirmar = window.confirm(
      'Deseja diminuir uma unidade deste equipamento?'
    );

    if (!confirmar) return;

    try {
      setAlterandoQuantidade(recursoId);
      setErroRecursos('');

      await apiRequest(
        `/api/Salas/${salaSelecionada}/recursos/${recursoId}/quantidade`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(1)
        }
      );

      await carregarRecursosDaSala();

    } catch (erro) {
      console.error('Erro ao diminuir quantidade:', erro);

      setErroRecursos(
        erro.message || 'Não foi possível diminuir a quantidade.'
      );
    } finally {
      setAlterandoQuantidade(null);
    }
  }

  // =====================================
  // REMOVER RECURSO COMPLETAMENTE DA SALA
  // =====================================

  async function removerRecurso(recursoId) {
    const confirmar = window.confirm(
      'Deseja realmente remover este equipamento da sala?'
    );

    if (!confirmar) return;

    try {
      setRemovendoRecurso(recursoId);
      setErroRecursos('');

      await apiRequest(
        `/api/Salas/${salaSelecionada}/recursos/${recursoId}`,
        {
          method: 'DELETE'
        }
      );

      await carregarRecursosDaSala();

    } catch (erro) {
      console.error('Erro ao remover recurso:', erro);

      setErroRecursos(
        erro.message || 'Não foi possível remover o recurso.'
      );
    } finally {
      setRemovendoRecurso(null);
    }
  }

  // =====================================
  // TELA
  // =====================================

  return (
    <div className="gestao-sala-page dashboard-container">

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

              Prof. Carlos

              <span style={{ fontSize: '9px', marginLeft: '3px' }}>
                ▼
              </span>
            </div>

          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="dashboard-content">

          {/* TÍTULO */}
          <div className="gestao-title-row">
            <div className="gestao-title">

              <img
                width="24"
                height="24"
                src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png"
                alt="Voltar"
                onClick={() => navigate(-1)}
              />

              <h1 className="page-title">
                Gestão da sala
              </h1>

            </div>
          </div>

          {/* PESQUISA DE SALAS */}
          <div className="pesquisa-sala-container">

            <img
              width="20"
              height="20"
              src="https://img.icons8.com/material-outlined/24/688596/search--v1.png"
              alt="Pesquisar"
            />

            <input
              type="text"
              className="pesquisa-sala-input"
              placeholder="Pesquisar sala pelo nome..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />

            {termoBusca && (
              <button
                type="button"
                className="limpar-pesquisa"
                onClick={() => setTermoBusca('')}
              >
                ×
              </button>
            )}

          </div>

          {/* RESULTADOS DA PESQUISA */}
          {termoBusca.trim() !== '' && (
            <div className="lista-resultados-salas">

              {salasFiltradas.length > 0 ? (
                salasFiltradas.map((sala) => (
                  <div
                    key={sala.id ?? sala.Id}
                    className="resultado-sala-gestao"
                    onClick={() => selecionarSala(sala)}
                  >
                    <strong>
                      {sala.nome ?? sala.Nome}
                    </strong>

                    <span>
                      Capacidade: {
                        sala.capacidade ?? sala.Capacidade
                      } pessoa(s)
                    </span>
                  </div>
                ))
              ) : (
                <p className="sem-resultados">
                  Nenhuma sala encontrada.
                </p>
              )}

            </div>
          )}

          {/* CARREGAMENTO E ERROS DAS SALAS */}
          {carregandoSalas && (
            <p className="mensagem-salas">
              Carregando salas...
            </p>
          )}

          {erroSalas && (
            <p className="erro-salas">
              {erroSalas}
            </p>
          )}

          {/* CARTÃO DA SALA */}
          {!carregandoSalas && salaAtual && (
            <div className="room-header-card">

              <div className="room-header-left">

                <div className="room-icon-box">
                  <img
                    width="40"
                    height="40"
                    src="https://img.icons8.com/material-outlined/48/1b89a8/image.png"
                    alt="Sala"
                  />
                </div>

                <div className="room-info-text">
                  <h2>{nomeSala}</h2>

                  <p>
                    Sala de aula - Capacidade: {capacidade}
                  </p>
                </div>

              </div>

              <div
                className={`status-badge-active ${
                  disponivel ? '' : 'indisponivel'
                }`}
              >
                {disponivel ? 'Ativa' : 'Indisponível'}
              </div>

            </div>
          )}

          {!carregandoSalas && !salaAtual && !erroSalas && (
            <p className="mensagem-salas">
              Selecione uma sala para visualizar suas informações.
            </p>
          )}

          {/* ABAS */}
          <div className="tabs-container">

            <button
              className={`tab-button ${
                activeTab === 'informacoes' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('informacoes')}
            >
              Informações
            </button>

            <button
              className={`tab-button ${
                activeTab === 'permissoes' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('permissoes')}
            >
              Permissões
            </button>

            <button
              className={`tab-button ${
                activeTab === 'configuracoes' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('configuracoes')}
            >
              Configurações
            </button>

          </div>

          {/* =====================================
              ABA INFORMAÇÕES
          ===================================== */}

          {activeTab === 'informacoes' && (
            <div className="info-main-card">

              {/* EQUIPAMENTOS */}
              <div className="info-section">

                <div className="section-title-row">

                  <h3>Equipamentos</h3>

                  <button
                    type="button"
                    className="btn-adicionar-item"
                    onClick={abrirModalRecursos}
                    disabled={!salaSelecionada}
                  >
                    + Adicionar item
                  </button>

                </div>

                {carregandoRecursos && (
                  <p className="light-text">
                    Carregando equipamentos...
                  </p>
                )}

                {erroRecursos && (
                  <p className="erro-salas">
                    {erroRecursos}
                  </p>
                )}

                {!carregandoRecursos && !erroRecursos && (
                  <ul className="check-list">

                    {recursos.length > 0 ? (
                      recursos.map((recurso) => {
                        const idRecurso = recurso.id ?? recurso.Id;

                        const quantidadeAtual =
                          recurso.quantidade ??
                          recurso.Quantidade ??
                          1;

                        const operacaoEmAndamento =
                          alterandoQuantidade === idRecurso ||
                          removendoRecurso === idRecurso;

                        return (
                          <li key={idRecurso}>

                            <img
                              width="16"
                              height="16"
                              src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png"
                              alt=""
                            />

                            <span>
                              {recurso.nome ?? recurso.Nome}
                              {' '}— Quantidade: {quantidadeAtual}
                            </span>

                            {/* DIMINUIR QUANTIDADE */}
                            <button
                              type="button"
                              className="btn-diminuir-recurso"
                              onClick={() =>
                                diminuirQuantidadeRecurso(idRecurso)
                              }
                              disabled={operacaoEmAndamento}
                              title="Diminuir uma unidade"
                              style={{
                                marginLeft: '8px',
                                padding: '4px 10px',
                                border: '1px solid #D8ECF2',
                                borderRadius: '6px',
                                background: '#F4FBFD',
                                color: '#0A4F68',
                                cursor: operacaoEmAndamento
                                  ? 'not-allowed'
                                  : 'pointer'
                              }}
                            >
                              {alterandoQuantidade === idRecurso
                                ? '...'
                                : '−'}
                            </button>

                            {/* REMOVER COMPLETAMENTE */}
                            <button
                              type="button"
                              className="btn-remover-recurso"
                              onClick={() => removerRecurso(idRecurso)}
                              disabled={operacaoEmAndamento}
                              title="Remover equipamento da sala"
                            >
                              {removendoRecurso === idRecurso
                                ? 'Removendo...'
                                : 'Remover'}
                            </button>

                          </li>
                        );
                      })
                    ) : (
                      <li className="light-text">
                        Nenhum equipamento cadastrado nesta sala.
                      </li>
                    )}

                  </ul>
                )}

              </div>

              {/* QUEM PODE USAR */}
              <div className="info-section">

                <h3>Quem pode usar esta sala</h3>

                <p className="light-text">
                  Professores, Coordenação e Funcionários
                  (conforme permissão)
                </p>

              </div>

              {/* HORÁRIOS */}
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
          )}

          {/* =====================================
              ABA PERMISSÕES
          ===================================== */}

          {activeTab === 'permissoes' && (
            <div className="info-main-card">

              <div className="info-section">

                <h3>Permissões de uso</h3>

                <p className="light-text">
                  As permissões de utilização da sala
                  serão configuradas aqui.
                </p>

              </div>

            </div>
          )}

          {/* =====================================
              ABA CONFIGURAÇÕES
          ===================================== */}

          {activeTab === 'configuracoes' && (
            <div className="info-main-card">

              <div className="info-section">

                <h3>Configurações da sala</h3>

                <p className="light-text">
                  As configurações da sala
                  serão disponibilizadas aqui.
                </p>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* =====================================
          MODAL DE ADICIONAR RECURSOS
      ===================================== */}

      {modalRecursosAberto && (
        <div
          className="modal-recursos-overlay"
          onClick={fecharModalRecursos}
        >

          <div
            className="modal-recursos"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-recursos-header">

              <div>
                <h2>Adicionar equipamento</h2>

                <p>
                  Selecione um recurso e informe a quantidade
                  que deseja adicionar à sala.
                </p>
              </div>

              <button
                type="button"
                className="modal-recursos-fechar"
                onClick={fecharModalRecursos}
                disabled={salvandoRecurso}
              >
                ×
              </button>

            </div>

            {mensagemRecurso && (
              <p className="mensagem-recurso-sucesso">
                {mensagemRecurso}
              </p>
            )}

            {erroModal && (
              <p className="erro-salas">
                {erroModal}
              </p>
            )}

            {carregandoTodosRecursos ? (
              <p className="light-text">
                Carregando recursos cadastrados...
              </p>
            ) : recursosDisponiveis.length > 0 ? (

              <div className="modal-recursos-lista">

                {recursosDisponiveis.map((recurso) => {
                  const idRecurso = String(
                    recurso.id ?? recurso.Id
                  );

                  const nomeRecurso =
                    recurso.nome ?? recurso.Nome;

                  const descricaoRecurso =
                    recurso.descricao ?? recurso.Descricao;

                  const recursoNaSala = recursos.find(
                    (item) =>
                      String(item.id ?? item.Id) === idRecurso
                  );

                  const quantidadeAtual =
                    recursoNaSala?.quantidade ??
                    recursoNaSala?.Quantidade ??
                    0;

                  return (
                    <label
                      key={idRecurso}
                      className={`modal-recurso-item ${
                        recursoSelecionado === idRecurso
                          ? 'selecionado'
                          : ''
                      }`}
                    >

                      <input
                        type="radio"
                        name="recurso"
                        value={idRecurso}
                        checked={recursoSelecionado === idRecurso}
                        onChange={() => {
                          setRecursoSelecionado(idRecurso);
                          setErroModal('');
                        }}
                      />

                      <div className="modal-recurso-info">

                        <strong>{nomeRecurso}</strong>

                        {descricaoRecurso && (
                          <span>{descricaoRecurso}</span>
                        )}

                        <span>
                          Quantidade atual na sala: {quantidadeAtual}
                        </span>

                      </div>

                    </label>
                  );
                })}

              </div>

            ) : (
              <p className="light-text">
                Nenhum recurso cadastrado no sistema.
              </p>
            )}

            {/* CAMPO DE QUANTIDADE */}
            <div
              className="campo-quantidade-recurso"
              style={{ marginTop: '16px' }}
            >

              <label htmlFor="quantidadeRecurso">
                Quantidade a adicionar
              </label>

              <input
                id="quantidadeRecurso"
                type="number"
                min="1"
                step="1"
                value={quantidadeRecurso}
                onChange={(e) => {
                  setQuantidadeRecurso(e.target.value);
                  setErroModal('');
                }}
                disabled={salvandoRecurso}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '140px',
                  marginTop: '6px',
                  padding: '10px',
                  border: '1px solid #D8ECF2',
                  borderRadius: '8px'
                }}
              />

            </div>

            <div className="modal-recursos-acoes">

              <button
                type="button"
                className="btn-cancelar-recurso"
                onClick={fecharModalRecursos}
                disabled={salvandoRecurso}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-confirmar-recurso"
                onClick={adicionarRecurso}
                disabled={
                  !recursoSelecionado ||
                  !Number.isInteger(Number(quantidadeRecurso)) ||
                  Number(quantidadeRecurso) <= 0 ||
                  salvandoRecurso ||
                  carregandoTodosRecursos
                }
              >
                {salvandoRecurso
                  ? 'Adicionando...'
                  : 'Adicionar à sala'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
