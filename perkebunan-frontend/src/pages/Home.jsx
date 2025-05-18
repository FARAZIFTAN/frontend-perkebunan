// src/pages/Home.jsx
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from '../components/organisms/Dashboard';
import HasilPanenDashboard from '../components/organisms/HasilPanenDashboard';
import PekerjaDashboard from '../components/organisms/PekerjaDashboard';
import LaporanDashboard from '../components/organisms/LaporanDashboard';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="app-title">Aplikasi Manajemen Perkebunan</h1>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className="nav-link" end>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/hasilpanen" className="nav-link">Hasil Panen</NavLink>
          </li>
          <li>
            <NavLink to="/pekerja" className="nav-link">Pekerja</NavLink>
          </li>
          <li>
            <NavLink to="/laporan" className="nav-link">Laporan</NavLink>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hasilpanen" element={<HasilPanenDashboard />} />
          <Route path="/pekerja" element={<PekerjaDashboard />} />
          <Route path="/laporan" element={<LaporanDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
