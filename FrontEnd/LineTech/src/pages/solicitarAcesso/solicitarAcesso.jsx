
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './solicitarAcessoStyle.css';

export default function SolicitarAcesso() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('pendentes');

    const [reservas, setReservas] = useState([]);
    const [salas, setSalas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [processando, setProcessando] = useState(null);

    // Carregar reservas, salas e usuários da API
    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
                setCarregando(true);
                setErro('');

                const [dadosReservas, dadosSalas, dadosUsuarios] =
                    await Promise.all([
                        apiRequest('/api/Reservas'),
                        apiRequest('/api/Salas'),
                        apiRequest('/api/Usuarios')
                    ]);

                setReservas(dadosReservas || []);
                setSalas(dadosSalas || []);
                setUsuarios(dadosUsuarios || []);

            } catch (error) {
                setErro(error.message || 'Erro ao carregar solicitações.');
            } finally {
                setCarregando(false);
            }
        }

        carregarSolicitacoes();
    }, []);

    // Formatar data e horário
    function formatarDataHora(data) {
        if (!data) return '';

        const dataObj = new Date(data);

        return (
            dataObj.toLocaleDateString('pt-BR', {
                timeZone: 'UTC'
            }) +
            ' - ' +
            dataObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            })
        );
    }

    // Encontrar sala e usuário relacionados à reserva
    function obterDadosReserva(reserva) {
        const sala = salas.find(item => item.id === reserva.salaId);
        const usuario = usuarios.find(item => item.id === reserva.usuarioId);

        return {
            nomeSala: sala?.nome || `Sala ${reserva.salaId}`,
            nomeUsuario: usuario?.nome || `Usuário ${reserva.usuarioId}`,
            perfilUsuario: usuario?.perfil || ''
        };
    }

    // Aprovar uma solicitação
    async function handleAprovar(reserva) {
        try {
            setErro('');
            setMensagem('');
            setProcessando(reserva.id);

            await apiRequest(`/api/Reservas/${reserva.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    usuarioId: reserva.usuarioId,
                    salaId: reserva.salaId,
                    dataInicio: reserva.dataInicio,
                    dataFim: reserva.dataFim,
                    finalidade: reserva.finalidade,
                    status: 'Confirmada'
                })
            });

            setReservas(prev =>
                prev.map(item =>
                    item.id === reserva.id
                        ? { ...item, status: 'Confirmada' }
                        : item
                )
            );

            setMensagem('Solicitação aprovada com sucesso!');

        } catch (error) {
            setErro(error.message || 'Não foi possível aprovar a solicitação.');
        } finally {
            setProcessando(null);
        }
    }

    // Recusar uma solicitação
    async function handleRecusar(reserva) {
        try {
            setErro('');
            setMensagem('');
            setProcessando(reserva.id);

            await apiRequest(
                `/api/Reservas/${reserva.id}/cancelar`,
                { method: 'PATCH' }
            );

            setReservas(prev =>
                prev.map(item =>
                    item.id === reserva.id
                        ? { ...item, status: 'Cancelada' }
                        : item
                )
            );

            setMensagem('Solicitação recusada com sucesso!');

        } catch (error) {
            setErro(error.message || 'Não foi possível recusar a solicitação.');
        } finally {
            setProcessando(null);
        }
    }

    // Filtrar reservas de acordo com a aba selecionada
    const reservasFiltradas = reservas.filter(reserva => {
        const status = (reserva.status || '').toLowerCase();

        if (activeTab === 'pendentes') {
            return status === 'pendente';
        }

        if (activeTab === 'aprovadas') {
            return status === 'confirmada' || status === 'aprovada';
        }

        if (activeTab === 'recusadas') {
            return status === 'recusada' || status === 'cancelada';
        }

        return false;
    });

    // Contar solicitações pendentes
    const totalPendentes = reservas.filter(
        reserva => (reserva.status || '').toLowerCase() === 'pendente'
    ).length;

    return (
        <div className="solicitar-acesso-page dashboard-container">

            {/* MENU LATERAL */}
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
                        className="menu-item active"
                        onClick={() => navigate('/solicitacoes')}
                    >
                        <img
                            className="menu-icon"
                            width="22"
                            height="22"
                            src="https://img.icons8.com/material-outlined/24/1b89a8/document--v1.png"
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

            {/* CONTEÚDO PRINCIPAL */}
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

                {/* ÁREA DA PÁGINA */}
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
                            Solicitação de acesso
                        </h1>
                    </div>

                    {/* ABAS */}
                    <div className="tabs-container">

                        <button
                            className={`tab-button ${activeTab === 'pendentes' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('pendentes');
                                setMensagem('');
                                setErro('');
                            }}
                        >
                            Pendentes ({totalPendentes})
                        </button>

                        <button
                            className={`tab-button ${activeTab === 'aprovadas' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('aprovadas');
                                setMensagem('');
                                setErro('');
                            }}
                        >
                            Aprovadas
                        </button>

                        <button
                            className={`tab-button ${activeTab === 'recusadas' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('recusadas');
                                setMensagem('');
                                setErro('');
                            }}
                        >
                            Recusadas
                        </button>

                    </div>

                    {/* MENSAGENS */}
                    {mensagem && (
                        <p
                            style={{
                                color: '#2e7d32',
                                backgroundColor: '#e8f5e9',
                                padding: '12px',
                                borderRadius: '6px',
                                marginBottom: '15px'
                            }}
                        >
                            {mensagem}
                        </p>
                    )}

                    {erro && (
                        <p
                            style={{
                                color: '#d32f2f',
                                backgroundColor: '#ffebee',
                                padding: '12px',
                                borderRadius: '6px',
                                marginBottom: '15px'
                            }}
                        >
                            {erro}
                        </p>
                    )}

                    {/* LISTA DE SOLICITAÇÕES */}
                    <div className="requests-list">

                        {carregando && (
                            <p>Carregando solicitações...</p>
                        )}

                        {!carregando && !erro && reservasFiltradas.length === 0 && (
                            <p>
                                Nenhuma solicitação encontrada nesta categoria.
                            </p>
                        )}

                        {!carregando && reservasFiltradas.map(reserva => {
                            const dados = obterDadosReserva(reserva);
                            const estaProcessando = processando === reserva.id;

                            return (
                                <div
                                    className="request-card-item"
                                    key={reserva.id}
                                >

                                    <div className="request-card-header">

                                        <div className="request-image-placeholder">
                                            <img
                                                width="36"
                                                height="36"
                                                src="https://img.icons8.com/material-outlined/48/1b89a8/image.png"
                                                alt="Imagem"
                                            />
                                        </div>

                                        <div className="request-details-info">

                                            <h3>{dados.nomeSala}</h3>

                                            <div className="info-row">
                                                <img
                                                    width="16"
                                                    height="16"
                                                    src="https://img.icons8.com/material-outlined/24/1b89a8/user.png"
                                                    alt="Usuário"
                                                />
                                                {dados.nomeUsuario}
                                            </div>

                                            <div className="info-row">
                                                <img
                                                    width="16"
                                                    height="16"
                                                    src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png"
                                                    alt="Data"
                                                />

                                                {formatarDataHora(reserva.dataInicio)}

                                                {' até '}

                                                {new Date(reserva.dataFim).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    timeZone: 'UTC'
                                                })}
                                            </div>

                                            <div className="info-row">
                                                <img
                                                    width="16"
                                                    height="16"
                                                    src="https://img.icons8.com/material-outlined/24/1b89a8/user-group-man-man.png"
                                                    alt="Motivo"
                                                />
                                                {reserva.finalidade}
                                            </div>

                                            <div className="info-row">
                                                <strong>Status:</strong>
                                                {' '}
                                                {reserva.status}
                                            </div>

                                        </div>

                                        <div
                                            className="arrow-link"
                                            onClick={() => navigate('/detalhes', {
                                                state: {
                                                    salaId: reserva.salaId,
                                                    reservaId: reserva.id
                                                }
                                            })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {'>'}
                                        </div>

                                    </div>

                                    {/* AÇÕES DAS SOLICITAÇÕES PENDENTES */}
                                    {activeTab === 'pendentes' && (
                                        <div className="card-action-buttons">

                                            <button
                                                className="btn-aprovar"
                                                type="button"
                                                disabled={processando !== null}
                                                onClick={() => handleAprovar(reserva)}
                                            >
                                                <span>✓</span>
                                                {estaProcessando ? 'Aprovando...' : 'Aprovar'}
                                            </button>

                                            <button
                                                className="btn-recusar"
                                                type="button"
                                                disabled={processando !== null}
                                                onClick={() => handleRecusar(reserva)}
                                            >
                                                <span>✕</span>
                                                {estaProcessando ? 'Recusando...' : 'Recusar'}
                                            </button>

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>

                    {/* RODAPÉ */}
                    <p className="account-footer-text">
                        Não tem uma conta?{' '}
                        <span
                            onClick={() => navigate('/detalhes')}
                            style={{ cursor: 'pointer' }}
                        >
                            Solicitar acesso
                        </span>
                    </p>

                </div>
            </main>
        </div>
    );
}
