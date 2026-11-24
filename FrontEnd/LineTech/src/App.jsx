
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/login/login';
import Inicio from './pages/Inicio/inicio';
import ConsultarDisponibilidade from './pages/consultarDisponibilidade/consultarDisponibilidade';
import DetalheSala from './pages/detalheSala/detalheSala';
import GestaoDeSala from './pages/gestaodeSala/gestaoDeSala';
import SolicitarAcesso from './pages/solicitarAcesso/solicitarAcesso';
import VisualizarSala from './pages/visualizarSala/visualizarSala';
import HistoricoReserva from './pages/historicoReserva/historicoReserva';
import HierarquiaUsuario from './pages/hierarquiaUsuario/hierarquiaUsuario';
import SalaLiberada from './pages/SalaLiberada/salaLiberada';
import Perfil from './pages/Perfil/perfil';
import Configuracoes from './pages/configuracoes/configuracoes';
import Cadastro from './pages/cadastro/cadastro';
import EsqueceuSenha from './pages/esqueceuSenha/EsqueceuSenha';

import './pages/Inicio/inicioStyle.css';

// Proteção de acesso para Gestores
function RotaGestor({ children }) {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch (erro) {
    console.error('Erro ao recuperar usuário:', erro);
  }

  // Verifica se existe um usuário autenticado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o usuário possui perfil de Gestor
  if (usuario.perfil !== 'Gestor') {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Rotas de Autenticação */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas do Sistema */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/consultar" element={<ConsultarDisponibilidade />} />
        <Route path="/detalhes" element={<DetalheSala />} />

        {/* Rota exclusiva para Gestores */}
        <Route
          path="/gestao"
          element={
            <RotaGestor>
              <GestaoDeSala />
            </RotaGestor>
          }
        />

        <Route path="/solicitacoes" element={<SolicitarAcesso />} />
        <Route path="/visualizar" element={<VisualizarSala />} />
        <Route path="/historico" element={<HistoricoReserva />} />
        <Route path="/hierarquia" element={<HierarquiaUsuario />} />
        <Route path="/liberada" element={<SalaLiberada />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

      </Routes>
    </Router>
  );
}
