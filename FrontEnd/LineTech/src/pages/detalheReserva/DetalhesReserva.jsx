
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './detalhesReservaStyle.css';

export default function DetalhesReserva() {
    const navigate = useNavigate();
    const location = useLocation();

    const reserva = location.state?.reserva;

    const [nomeResponsavel, setNomeResponsavel] = useState('Carregando...');
    const [perfilResponsavel, setPerfilResponsavel] = useState('Carregando...');

    // Buscar nome e perfil do responsável pela reserva
    useEffect(() => {
        async function carregarResponsavel() {
            if (!reserva) return;

            const usuarioId = Number(
                reserva.usuarioId ?? reserva.UsuarioId
            );

            try {
                const usuarios = await apiRequest('/api/Usuarios');

                const responsavel = usuarios.find(
                    usuario => Number(usuario.id ?? usuario.Id) === usuarioId
                );

                setNomeResponsavel(
                    responsavel?.nome ??
                    responsavel?.Nome ??
                    'Usuário não encontrado'
                );

                setPerfilResponsavel(
                    responsavel?.perfil ??
                    responsavel?.Perfil ??
                    'Não informado'
                );

            } catch (error) {
                setNomeResponsavel(
                    'Não foi possível carregar o responsável'
                );
                setPerfilResponsavel('Não informado');
            }
        }

        carregarResponsavel();
    }, [reserva]);

    const usuario = JSON.parse(
        localStorage.getItem('usuario') || '{}'
    );

    function formatarData(data) {
        if (!data) return 'Não informado';

        return new Date(data).toLocaleDateString('pt-BR');
    }

    function formatarHorario(data) {
        if (!data) return 'Não informado';

        return new Date(data).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Calcular duração da reserva
    function calcularDuracao(inicio, fim) {
        if (!inicio || !fim) return 'Não informado';

        const dataInicio = new Date(inicio);
        const dataFim = new Date(fim);

        const diferenca = dataFim - dataInicio;

        if (
            Number.isNaN(dataInicio.getTime()) ||
            Number.isNaN(dataFim.getTime()) ||
            diferenca <= 0
        ) {
            return 'Não informado';
        }

        const totalMinutos = Math.floor(diferenca / 60000);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        if (horas === 0) {
            return `${minutos} minuto(s)`;
        }

        if (minutos === 0) {
            return `${horas} hora(s)`;
        }

        return `${horas} hora(s) e ${minutos} minuto(s)`;
    }

    function obterStatus(status) {
        const statusNormalizado = String(status || '').toLowerCase();

        if (statusNormalizado === 'confirmada') return 'Confirmada';
        if (statusNormalizado === 'pendente') return 'Pendente';
        if (statusNormalizado === 'cancelada') return 'Cancelada';

        return status || 'Não informado';
    }

    // Verificar se existe uma reserva selecionada
    if (!reserva) {
        return (
            <div className="detalhes-reserva-page dashboard-container">
                <p>Nenhuma reserva foi selecionada.</p>

                <button onClick={() => navigate('/historico')}>
                    Voltar para o histórico
                </button>
            </div>
        );
    }

    const reservaId = reserva.id ?? reserva.Id;
    const nomeSala = reserva.nomeSala ?? reserva.NomeSala ?? 'Não informado';
    const finalidade = reserva.finalidade ?? reserva.Finalidade;
    const dataInicio = reserva.dataInicio ?? reserva.DataInicio;
    const dataFim = reserva.dataFim ?? reserva.DataFim;
    const dataCriacao = reserva.dataCriacao ?? reserva.DataCriacao;
    const status = reserva.status ?? reserva.Status;

    const duracao = calcularDuracao(dataInicio, dataFim);

    return (
        <div className="detalhes-reserva-page dashboard-container">

            {/* BARRA LATERAL */}
            <aside className="sidebar">
                <div className="sidebar-menu">

                    <div className="menu-item" onClick={() => navigate('/inicio')}>
                        <img
                            width="22"
                            height="22"
                            src="https://img.icons8.com/material-outlined/24/688596/home--v2.png"
                            alt="Início"
                        />
                        Início
                    </div>

                    <div className="menu-item active" onClick={() => navigate('/historico')}>
                        <img
                            width="22"
                            height="22"
                            src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png"
                            alt="Reservas"
                        />
                        Reservas
                    </div>

                    <div className="menu-item" onClick={() => navigate('/consultar')}>
                        <img
                            width="22"
                            height="22"
                            src="https://img.icons8.com/material-outlined/24/688596/door.png"
                            alt="Salas"
                        />
                        Salas
                    </div>

                    <div className="menu-item" onClick={() => navigate('/solicitacoes')}>
                        <img
                            width="22"
                            height="22"
                            src="https://img.icons8.com/material-outlined/24/688596/document--v1.png"
                            alt="Solicitações"
                        />
                        Solicitações
                    </div>

                    <div className="menu-item" onClick={() => navigate('/perfil')}>
                        <img
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
                            placeholder="Buscar reservas, salas..."
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

                            {usuario.nome || usuario.Nome || 'Usuário'}

                            <span style={{ fontSize: '9px', marginLeft: '3px' }}>
                                ▼
                            </span>
                        </div>

                    </div>
                </header>

                {/* CONTEÚDO */}
                <div className="dashboard-content">

                    {/* TÍTULO */}
                    <div className="detalhes-reserva-titulo">

                        <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png"
                            alt="Voltar"
                            onClick={() => navigate(-1)}
                        />

                        <h1 className="page-title">
                            Detalhes da reserva
                        </h1>

                    </div>

                    <div className="detalhes-reserva-grid">

                        {/* INFORMAÇÕES DA RESERVA */}
                        <div className="reserva-info-card">

                            <div className="reserva-header">

                                <div className="reserva-image">
                                    <img
                                        width="44"
                                        height="44"
                                        src="https://img.icons8.com/material-outlined/48/1b89a8/calendar--v1.png"
                                        alt="Reserva"
                                    />
                                </div>

                                <div>
                                    <h2>Reserva #{reservaId}</h2>
                                    <p>{nomeSala}</p>
                                </div>

                            </div>

                            {/* STATUS */}
                            <div className="reserva-status-section">
                                <h3>Status da reserva</h3>

                                <span className={`reserva-status status-${String(status).toLowerCase()}`}>
                                    {obterStatus(status)}
                                </span>
                            </div>

                            {/* INFORMAÇÕES */}
                            <div className="reserva-info-section">
                                <h3>Informações da reserva</h3>

                                <div className="reserva-info-item">
                                    <span>Nome da sala</span>
                                    <strong>{nomeSala}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Número da reserva</span>
                                    <strong>#{reservaId}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Responsável</span>
                                    <strong>{nomeResponsavel}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Perfil do responsável</span>
                                    <strong>{perfilResponsavel}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Finalidade</span>
                                    <strong>{finalidade || 'Não informada'}</strong>
                                </div>
                            </div>

                            {/* DATA E HORÁRIO */}
                            <div className="reserva-info-section">
                                <h3>Data e horário</h3>

                                <div className="reserva-info-item">
                                    <span>Data</span>
                                    <strong>{formatarData(dataInicio)}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Horário de início</span>
                                    <strong>{formatarHorario(dataInicio)}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Horário de término</span>
                                    <strong>{formatarHorario(dataFim)}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Duração da reserva</span>
                                    <strong>{duracao}</strong>
                                </div>

                                <div className="reserva-info-item">
                                    <span>Data de criação</span>
                                    <strong>{formatarData(dataCriacao)}</strong>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
