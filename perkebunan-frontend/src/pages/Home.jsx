// src/pages/Home.jsx - Enhanced with more animations
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from '../components/organisms/Dashboard';
import HasilPanenDashboard from '../components/organisms/HasilPanenDashboard';
import PekerjaDashboard from '../components/organisms/PekerjaDashboard';
import LaporanDashboard from '../components/organisms/LaporanDashboard';
import './Home.css';
import '../components/styles/advanced-animations.css'; // Import animasi tambahan

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  
  // Mengatur salam berdasarkan waktu
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Selamat Pagi');
      } else if (hour >= 12 && hour < 15) {
        setGreeting('Selamat Siang');
      } else if (hour >= 15 && hour < 19) {
        setGreeting('Selamat Sore');
      } else {
        setGreeting('Selamat Malam');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Format tanggal ke bahasa Indonesia
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Format waktu
  const formatTime = (date) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleTimeString('id-ID', options);
  };

  // Acara pertanian terdekat (contoh data)
  const upcomingEvents = [
    { date: '25 Mei 2025', name: 'Panen Padi' },
    { date: '30 Mei 2025', name: 'Tanam Jagung' },
    { date: '5 Juni 2025', name: 'Pemupukan Kebun A' }
  ];

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="app-title">
            <span className="app-logo animated-logo">🌱</span>
            <span className="app-title-text">Aplikasi Manajemen Perkebunan</span>
          </h1>
        </div>
        
        <div className="datetime-display">
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" className="nav-link" end>
              <span className="nav-link-icon">🏡</span>
              <span className="nav-link-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/hasilpanen" className="nav-link">
              <span className="nav-link-icon">🌾</span>
              <span className="nav-link-text">Hasil Panen</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/pekerja" className="nav-link">
              <span className="nav-link-icon">👨‍🌾</span>
              <span className="nav-link-text">Pekerja</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/laporan" className="nav-link">
              <span className="nav-link-icon">📊</span>
              <span className="nav-link-text">Laporan</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="welcome-banner">
        <div className="greeting-text">
          <h2>{greeting}, Selamat Datang di Sistem Manajemen Perkebunan!</h2>
          <p>Kelola perkebunan Anda dengan lebih efisien dan produktif</p>
        </div>
        
        <div className="upcoming-events">
          <h3><span className="events-icon">📅</span> Jadwal Kegiatan Terdekat</h3>
          <ul className="events-list">
            {upcomingEvents.map((event, index) => (
              <li key={index} className="event-item">
                <span className="event-date">{event.date}</span>
                <span className="event-name">{event.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="content">
        <div className="page-transition-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hasilpanen" element={<HasilPanenDashboard />} />
            <Route path="/pekerja" element={<PekerjaDashboard />} />
            <Route path="/laporan" element={<LaporanDashboard />} />
          </Routes>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Tentang Aplikasi</h4>
            <p>Aplikasi Manajemen Perkebunan dirancang untuk membantu Anda mengelola perkebunan dengan lebih efisien, mengoptimalkan hasil panen, dan meningkatkan produktivitas.</p>
          </div>
          
          <div className="footer-section">
            <h4>Fitur Utama</h4>
            <ul>
              <li>Manajemen Tanaman</li>
              <li>Pencatatan Hasil Panen</li>
              <li>Pengelolaan Pekerja</li>
              <li>Laporan Perkebunan</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hubungi Kami</h4>
            <p>Email: info@pertanianku.id</p>
            <p>Telepon: +62 123 4567 890</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Aplikasi Manajemen Perkebunan - Hak Cipta Dilindungi</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;