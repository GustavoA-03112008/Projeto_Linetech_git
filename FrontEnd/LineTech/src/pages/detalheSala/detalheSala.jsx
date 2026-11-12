
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './detalheSalaStyle.css';

export default function DetalheSala() {
    const navigate = useNavigate();
    const location = useLocation();

    const salaId = location.state?.salaId;

    const [sala, setSala] = useState(null);
    const [recursos, setRecursos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    // Campos do formulário
    const [finalidade, setFinalidade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('14:00');
    const [horaFim, setHoraFim] = useState('16:00');
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    // Carregar dados da sala e seus recursos
    useEffect(() => {
        async function carregarDadosSala() {
            if (!salaId) {
                setErro('Nenhuma sala foi selecionada.');
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro('');

                const dadosSala = await apiRequest(`/api/Salas/${salaId}`);
                setSala(dadosSala);

                const dadosRecursos = await apiRequest(
                    `/api/Salas/${salaId}/recursos`
                );

                setRecursos(dadosRecursos || []);
            } catch (error) {
                setErro(error.message || 'Erro ao carregar os dados da sala.');
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosSala();
    }, [salaId]);

    // Enviar solicitação de reserva
    async function handleEnviarSolicitacao() {
        setMensagem('');
        setTipoMensagem('');

        const usuario = JSON.parse(
            localStorage.getItem('usuario') || '{}'
        );

        const usuarioId = usuario.id ?? usuario.Id;

        if (!usuarioId) {
            setMensagem(
                'Não foi possível identificar o usuário. Faça login novamente.'
            );
            setTipoMensagem('erro');
            return;
        }

        if (!finalidade) {
            setMensagem('Selecione o motivo da solicitação.');
            setTipoMensagem('erro');
            return;
        }

        if (!data) {
            setMensagem('Selecione a data da reserva.');
            setTipoMensagem('erro');
            return;
        }

        const dataInicio = `${data}T${horaInicio}:00`;
        const dataFim = `${data}T${horaFim}:00`;

        if (new Date(dataFim) <= new Date(dataInicio)) {
            setMensagem(
                'O horário final deve ser posterior ao horário inicial.'
            );
            setTipoMensagem('erro');
            return;
        }

        const finalidadeCompleta = descricao.trim()
            ? `${finalidade} - ${descricao.trim()}`
            : finalidade;

        try {
            setEnviando(true);

            await apiRequest('/api/Reservas', {
                method: 'POST',
                body: JSON.stringify({
                    usuarioId: Number(usuarioId),
                    salaId: Number(salaId),
                    dataInicio,
                    dataFim,
                    finalidade: finalidadeCompleta
                })
            });

            setMensagem(
                'Solicitação enviada com sucesso! Aguarde a aprovação da Coordenação.'
            );
            setTipoMensagem('sucesso');

            setFinalidade('');
            setDescricao('');
            setData('');
            setHoraInicio('14:00');
            setHoraFim('16:00');

        } catch (error) {
            setMensagem(
                error.message || 'Não foi possível enviar a solicitação.'
            );
            setTipoMensagem('erro');
        } finally {
            setEnviando(false);
        }
    }

    const usuario = JSON.parse(
        localStorage.getItem('usuario') || '{}'
    );

    // Carregamento
    if (carregando) {
        return (
            <div className="detalhe-sala-page dashboard-container">
                <p>Carregando dados da sala...</p>
            </div>
        );
    }

    // Erro ao carregar sala
    if (erro || !sala) {
        return (
            <div className="detalhe-sala-page dashboard-container">
                <p>{erro || 'Sala não encontrada.'}</p>

                <button onClick={() => navigate('/consultar')}>
                    Voltar para salas
                </button>
            </div>
        );
    }

    const nomeSala = sala.nome ?? sala.Nome;
    const capacidadeSala = sala.capacidade ?? sala.Capacidade;

    return (
        <div className="detalhe-sala-page dashboard-container">

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

                    <div className="menu-item active" onClick={() => navigate('/consultar')}>
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

                            {usuario.nome || usuario.Nome || 'Usuário'}

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
                            Detalhes da sala
                        </h1>
                    </div>

                    <div className="details-grid">

                        {/* COLUNA ESQUERDA */}
                        <div className="left-column">
                            <div className="room-info-card">

                                <div className="room-header-section">

                                    <div className="room-image-placeholder">
                                        <img
                                            width="44"
                                            height="44"
                                            src="https://img.icons8.com/material-outlined/48/1b89a8/image.png"
                                            alt="Imagem da Sala"
                                        />
                                    </div>

                                    <div className="room-title-info">
                                        <h2>{nomeSala}</h2>
                                        <p>Capacidade: {capacidadeSala} pessoas</p>
                                        <p>Piso: 1º andar</p>
                                        <p>Sala de aula</p>
                                    </div>

                                </div>

                                {/* EQUIPAMENTOS */}
                                <div className="info-section">
                                    <h3>Equipamentos</h3>

                                    <ul className="check-list">
                                        {recursos.length > 0 ? (
                                            recursos.map((recurso) => (
                                                <li key={recurso.id ?? recurso.Id}>
                                                    <img
                                                        width="16"
                                                        height="16"
                                                        src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png"
                                                        alt="check"
                                                    />

                                                    {recurso.nome ?? recurso.Nome}
                                                </li>
                                            ))
                                        ) : (
                                            <li>
                                                Nenhum recurso cadastrado nesta sala.
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* PERMISSÕES */}
                                <div className="info-section">
                                    <h3>Quem pode usar esta sala</h3>

                                    <p className="light-text">
                                        Professores, Coordenação e Funcionários
                                        (conforme permissão)
                                    </p>
                                </div>

                                {/* HORÁRIOS */}
                                <div className="info-section">
                                    <h3>Horários de acesso</h3>

                                    <div className="access-times">
                                        <p>
                                            <span className="role">Administrativo:</span>
                                            {' '}Acesso total
                                        </p>

                                        <p>
                                            <span className="role">Coordenação:</span>
                                            {' '}Reserva e aprovação
                                        </p>

                                        <p>
                                            <span className="role">Professores:</span>
                                            {' '}Necessitam de aprovação
                                        </p>

                                        <p>
                                            <span className="role">Funcionários:</span>
                                            {' '}Conforme permissão
                                        </p>

                                        <p>
                                            <span className="role">Alunos:</span>
                                            {' '}Apenas consulta (se permitido)
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* COLUNA DIREITA */}
                        <div className="right-column">
                            <div className="request-card">

                                <h3>Solicitar acesso</h3>

                                {/* MOTIVO */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Motivo da solicitação
                                    </label>

                                    <div className="select-wrapper">
                                        <select
                                            className="form-input"
                                            value={finalidade}
                                            onChange={(e) => setFinalidade(e.target.value)}
                                        >
                                            <option value="">
                                                Selecione o motivo
                                            </option>

                                            <option value="Aula">Aula</option>
                                            <option value="Reunião">Reunião</option>
                                            <option value="Treinamento">Treinamento</option>
                                            <option value="Evento">Evento</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                </div>

                                {/* DESCRIÇÃO */}
                                <div className="form-group">
                                    <textarea
                                        className="form-input"
                                        placeholder="Descreva o motivo da solicitação (opcional)"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                    />
                                </div>

                                {/* DATA */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Data
                                    </label>

                                    <div className="input-with-icon">
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={data}
                                            onChange={(e) => setData(e.target.value)}
                                        />

                                        <img
                                            className="input-icon"
                                            width="20"
                                            height="20"
                                            src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png"
                                            alt="Calendário"
                                        />
                                    </div>
                                </div>

                                {/* HORÁRIOS */}
                                <div className="form-row">

                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">
                                            Horário inicial
                                        </label>

                                        <div className="select-wrapper">
                                            <select
                                                className="form-input"
                                                value={horaInicio}
                                                onChange={(e) => setHoraInicio(e.target.value)}
                                            >
                                                <option value="08:00">08:00</option>
                                                <option value="09:00">09:00</option>
                                                <option value="10:00">10:00</option>
                                                <option value="11:00">11:00</option>
                                                <option value="12:00">12:00</option>
                                                <option value="13:00">13:00</option>
                                                <option value="14:00">14:00</option>
                                                <option value="15:00">15:00</option>
                                                <option value="16:00">16:00</option>
                                                <option value="17:00">17:00</option>
                                                <option value="18:00">18:00</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">
                                            Horário final
                                        </label>

                                        <div className="select-wrapper">
                                            <select
                                                className="form-input"
                                                value={horaFim}
                                                onChange={(e) => setHoraFim(e.target.value)}
                                            >
                                                <option value="09:00">09:00</option>
                                                <option value="10:00">10:00</option>
                                                <option value="11:00">11:00</option>
                                                <option value="12:00">12:00</option>
                                                <option value="13:00">13:00</option>
                                                <option value="14:00">14:00</option>
                                                <option value="15:00">15:00</option>
                                                <option value="16:00">16:00</option>
                                                <option value="17:00">17:00</option>
                                                <option value="18:00">18:00</option>
                                                <option value="19:00">19:00</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                {/* MENSAGEM */}
                                {mensagem && (
                                    <p
                                        style={{
                                            color: tipoMensagem === 'sucesso'
                                                ? '#218838'
                                                : '#d32f2f',
                                            fontSize: '13px'
                                        }}
                                    >
                                        {mensagem}
                                    </p>
                                )}

                                {/* BOTÃO */}
                                <button
                                    className="btn-enviar"
                                    type="button"
                                    onClick={handleEnviarSolicitacao}
                                    disabled={enviando}
                                >
                                    {enviando
                                        ? 'Enviando...'
                                        : 'Enviar solicitação'}
                                </button>

                                {/* RODAPÉ */}
                                <div className="request-footer-info">

                                    <div className="info-alert">
                                        <img
                                            width="18"
                                            height="18"
                                            src="https://img.icons8.com/material-outlined/24/1b89a8/info.png"
                                            alt="Info"
                                        />

                                        Sua solicitação será analisada pela Coordenação.
                                    </div>

                                    <div className="summary-grid">

                                        <div className="summary-item">
                                            <img
                                                width="22"
                                                height="22"
                                                src="https://img.icons8.com/material-outlined/24/1b89a8/user-group-man-man.png"
                                                alt="Capacidade"
                                            />

                                            <p>
                                                Capacidade<br />
                                                <strong>{capacidadeSala} pessoas</strong>
                                            </p>
                                        </div>

                                        <div className="summary-item">
                                            <img
                                                width="22"
                                                height="22"
                                                src="https://img.icons8.com/material-outlined/24/1b89a8/product.png"
                                                alt="Tipo"
                                            />

                                            <p>
                                                Tipo de sala<br />
                                                <strong>Sala de aula</strong>
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
