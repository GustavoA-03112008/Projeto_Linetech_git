import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastroStyle.css';

export default function Cadastro() {
  const navigate = useNavigate();

  // Estado do perfil selecionado ('Professor' ou 'Gestor')
  const [tipoUsuario, setTipoUsuario] = useState('Professor');

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Visibilidade das senhas
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Feedback de erro e carregamento
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastrar(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);

      const dadosCadastro = {
        tipoUsuario,
        nome: nome.trim(),
        email: email.trim(),
        senha
      };

      console.log('Dados do cadastro:', dadosCadastro);
      // Aqui você pode chamar sua apiRequest('/api/...', { method: 'POST', body: JSON.stringify(dadosCadastro) })
      // navigate('/login');
    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-wrapper">

        {/* Título superior simples */}
        <div className="cadastro-topo">
          <span className="cadastro-topo-texto">Cadastro</span>
        </div>

        {/* Card Principal */}
        <div className="cadastro-card">
          <h1 className="cadastro-titulo">Crie sua conta</h1>
          <p className="cadastro-subtitulo">
            Preencha os dados abaixo para se cadastrar.
          </p>

          {/* Seletor de Tipo de Usuário */}
          <div className="perfil-section">
            <label className="perfil-label">Tipo de usuário</label>
            <span className="perfil-descricao">
              Selecione o perfil que melhor representa você.
            </span>

            <div className="perfil-opcoes">
              {/* Opção Professor */}
              <div
                className={`perfil-card ${tipoUsuario === 'Professor' ? 'ativo' : ''}`}
                onClick={() => setTipoUsuario('Professor')}
              >
                <span className="radio-indicador">
                  {tipoUsuario === 'Professor' && <span className="radio-ponto" />}
                </span>
                <svg className="perfil-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 10L12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  <path d="M22 10v6" />
                </svg>
                <span className="perfil-nome">Professor</span>
              </div>

              {/* Opção Gestor */}
              <div
                className={`perfil-card ${tipoUsuario === 'Gestor' ? 'ativo' : ''}`}
                onClick={() => setTipoUsuario('Gestor')}
              >
                <span className="radio-indicador">
                  {tipoUsuario === 'Gestor' && <span className="radio-ponto" />}
                </span>
                <svg className="perfil-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="perfil-nome">Gestor</span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleCadastrar} className="cadastro-form">
            {/* Nome completo */}
            <div className="cadastro-input-box">
              <svg className="campo-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* E-mail */}
            <div className="cadastro-input-box">
              <svg className="campo-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha */}
            <div className="cadastro-input-box">
              <svg className="campo-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                tabIndex="-1"
              >
                {mostrarSenha ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirmar senha */}
            <div className="cadastro-input-box">
              <svg className="campo-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarConfirmarSenha ? 'text' : 'password'}
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <button
                type="button"
                className="btn-olho"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                tabIndex="-1"
              >
                {mostrarConfirmarSenha ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {erro && <p className="cadastro-erro">{erro}</p>}

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>

        {/* Link inferior */}
        <p className="cadastro-rodape-link">
          Já tem uma conta?{' '}
          <span onClick={() => navigate('/login')}>Entrar</span>
        </p>

      </div>
    </div>
  );
}