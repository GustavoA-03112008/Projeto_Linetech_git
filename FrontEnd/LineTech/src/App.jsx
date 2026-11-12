import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Notificacoes from './pages/notificacoes/notificacoes'; // Nome em minúsculo
import EsqueceuSenha from './pages/esqueceuSenha/EsqueceuSenha'; // Nome em minúsculo
import './pages/Inicio/inicioStyle.css';

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
        <Route path="/gestao" element={<GestaoDeSala />} />
        <Route path="/solicitacoes" element={<SolicitarAcesso />} />
        <Route path="/visualizar" element={<VisualizarSala />} />
        <Route path="/historico" element={<HistoricoReserva />} />
        <Route path="/hierarquia" element={<HierarquiaUsuario />} />
        <Route path="/liberada" element={<SalaLiberada />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
      </Routes>
    </Router>
  );
}