// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Halaman Tidak Ditemukan</h1>
      <p style={styles.text}>Maaf, halaman yang Anda cari tidak tersedia.</p>
      <Link to="/" style={styles.link}>Kembali ke Beranda</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#555',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '20px',
  },
};

export default NotFound;
