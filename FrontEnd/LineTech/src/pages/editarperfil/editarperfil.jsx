
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import './editarperfilStyle.css';

export default function EditarPerfil() {
  const navigate = useNavigate();

  // Recupera os dados do usuário logado
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [nome, setNome] = useState(usuario.nome || usuario.Nome || '');
  const [email, setEmail] = useState(usuario.email || usuario.Email || '');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Salvar alterações do perfil
  async function handleSalvar(e) {
    e.preventDefault();

    setMensagem('');
    setErro(false);

    if (!nome.trim() || !email.trim()) {
      setMensagem('Preencha o nome e o e-mail.');
      setErro(true);
      return;
    }

    if (!senhaAtual) {
      setMensagem('Informe sua senha atual para confirmar as alterações.');
      setErro(true);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('A nova senha e a confirmação não são iguais.');
      setErro(true);
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      setMensagem('A nova senha deve ter pelo menos 6 caracteres.');
      setErro(true);
      return;
    }

    try {
      setSalvando(true);

      const dados = {
        nome: nome.trim(),
        email: email.trim(),
        senhaAtual: senhaAtual,
        novaSenha: novaSenha || null
      };

      const resposta = await apiRequest('/api/Login/perfil', {
        method: 'PUT',
        body: JSON.stringify(dados)
      });

      // Atualiza os dados salvos no navegador
      const usuarioAtualizado = {
        ...usuario,
        ...resposta.usuario
      };

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioAtualizado)
      );

      setNome(usuarioAtualizado.nome || usuarioAtualizado.Nome || '');
      setEmail(usuarioAtualizado.email || usuarioAtualizado.Email || '');

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      setMensagem(resposta.mensagem || 'Perfil atualizado com sucesso.');
      setErro(false);

    } catch (error) {
      setMensagem(error.message || 'Não foi possível atualizar o perfil.');
      setErro(true);

    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="configuracoes-page dashboard-container">

      {/* BARRA LATERAL */}
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

          <div className="menu-item active" onClick={() => navigate('/perfil')}>
            <img className="menu-icon" width="22" height="22" src="https://img.icons8.com/material-outlined/24/1b89a8/user--v1.png" alt="Perfil" />
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
            <input type="text" className="search-input" placeholder="Buscar salas, atividades..." />
          </div>

          <div className="topbar-actions">
            <div className="notification-icon" onClick={() => navigate('/notificacoes')}>
              <img width="22" height="22" style={{ cursor: 'pointer' }} src="https://img.icons8.com/material-outlined/24/1b89a8/appointment-reminders.png" alt="Notificações" />
            </div>

            <div className="profile-section" onClick={() => navigate('/perfil')}>
              <img width="28" height="28" src="https://img.icons8.com/material-rounded/28/1b89a8/user-male-circle.png" alt="Usuário" />
              {nome || 'Usuário'}
              <span style={{ fontSize: '9px', marginLeft: '3px' }}>▼</span>
            </div>
          </div>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <div className="dashboard-content">

          {/* TÍTULO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/1b89a8/back--v1.png"
              alt="Voltar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            />
            <h1 className="page-title" style={{ margin: 0 }}>Editar Perfil</h1>
          </div>

          <form onSubmit={handleSalvar}>

            {/* DADOS PESSOAIS */}
            <h2 className="section-title">Dados pessoais</h2>

            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>

   
            {/* ALTERAR SENHA */}
            <h2 className="section-title">Alterar senha</h2>

            <div className="form-group">
              <div className="input-password-wrapper">
                <input
                  type={showSenhaAtual ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />

                <img
                  className="password-toggle-icon"
                  width="20"
                  height="20"
                  src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png"
                  alt="Mostrar senha"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-password-wrapper">
                <input
                  type={showNovaSenha ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />

                <img
                  className="password-toggle-icon"
                  width="20"
                  height="20"
                  src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png"
                  alt="Mostrar senha"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-password-wrapper">
                <input
                  type={showConfirmarSenha ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirmar nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <img
                  className="password-toggle-icon"
                  width="20"
                  height="20"
                  src="https://img.icons8.com/material-outlined/24/1b89a8/visible--v1.png"
                  alt="Mostrar senha"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                />
              </div>
            </div>

            {/* MENSAGEM DE RETORNO */}
            {mensagem && (
              <p
                style={{
                  color: erro ? '#d32f2f' : '#218838',
                  marginTop: '12px'
                }}
              >
                {mensagem}
              </p>
            )}

            <button
              type="submit"
              className="btn-salvar-alteracoes"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
