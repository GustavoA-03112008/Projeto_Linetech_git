import React from 'react';
import { useNavigate } from 'react-router-dom';
import './detalheSalaStyle.css';

export default function DetalheSala() {
    const navigate = useNavigate();

    return (
        <div className="detalhe-sala-page dashboard-container">

            {/* BARRA LATERAL (SIDEBAR) */}
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
                    <div className="menu-item active" onClick={() => navigate('/consultar')}>
                        <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/door.png" alt="Salas" />
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
                        <div className="notification-icon" onClick={() => navigate('/notificacoes')}>
                            <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />
                        </div>
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
                        <h1 className="page-title" style={{ margin: 0 }}>Detalhes da sala</h1>
                    </div>

                    <div className="details-grid">

                        {/* COLUNA ESQUERDA - INFORMAÇÕES */}
                        <div className="left-column">
                            <div className="room-info-card">

                                <div className="room-header-section">
                                    <div className="room-image-placeholder">
                                        <img width="44" height="44" src="https://img.icons8.com/material-outlined/48/1b89a8/image.png" alt="Imagem da Sala" />
                                    </div>
                                    <div className="room-title-info">
                                        <h2>Sala 1.34</h2>
                                        <p>Capacidade: 30 pessoas</p>
                                        <p>Piso: 1º andar</p>
                                        <p>Sala de aula</p>
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h3>Equipamentos</h3>
                                    <ul className="check-list">
                                        <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Projetor</li>
                                        <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Computadores (20)</li>
                                        <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Ar-condicionado</li>
                                        <li><img width="16" height="16" src="https://img.icons8.com/material-outlined/16/1b89a8/polyline.png" alt="check" /> Quadro branco</li>
                                    </ul>
                                </div>

                                <div className="info-section">
                                    <h3>Quem pode usar esta sala</h3>
                                    <p className="light-text">Professores, Coordenação e Funcionários (conforme permissão)</p>
                                </div>

                                <div className="info-section">
                                    <h3>Horários de acesso</h3>
                                    <div className="access-times">
                                        <p><span className="role">Administrativo:</span> Acesso total</p>
                                        <p><span className="role">Coordenação:</span> Reserva e aprovação</p>
                                        <p><span className="role">Professores:</span> Necessitam de aprovação</p>
                                        <p><span className="role">Funcionários:</span> Conforme permissão</p>
                                        <p><span className="role">Alunos:</span> Apenas consulta (se permitido)</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* COLUNA DIREITA - FORMULÁRIO DE SOLICITAÇÃO */}
                        <div className="right-column">
                            <div className="request-card">
                                <h3>Solicitar acesso</h3>

                                <div className="form-group">
                                    <label className="form-label">Motivo da solicitação</label>
                                    <div className="select-wrapper">
                                        <select className="form-input">
                                            <option>Selecione o motivo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <textarea className="form-input" placeholder="Descreva o motivo da solicitação (opcional)"></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Data</label>
                                    <div className="input-with-icon">
                                        <input type="text" className="form-input" defaultValue="08/10/2026" />
                                        <img className="input-icon" width="20" height="20" src="https://img.icons8.com/material-outlined/24/1b89a8/calendar--v1.png" alt="Calendário" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Horário</label>
                                        <div className="select-wrapper">
                                            <select className="form-input"><option>14:00</option></select>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">&nbsp;</label>
                                        <div className="select-wrapper">
                                            <select className="form-input"><option>16:00</option></select>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-enviar">Enviar solicitação</button>

                                <div className="request-footer-info">
                                    <div className="info-alert">
                                        <img width="18" height="18" src="https://img.icons8.com/material-outlined/24/1b89a8/info.png" alt="Info" />
                                        Sua solicitação será analisada pela Coordenação.
                                    </div>

                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/user-group-man-man.png" alt="Capacidade" />
                                            <p>Capacidade<br /><strong>30 pessoas</strong></p>
                                        </div>
                                        <div className="summary-item">
                                            <img width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/product.png" alt="Tipo" />
                                            <p>Tipo de sala<br /><strong>Sala de aula</strong></p>
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