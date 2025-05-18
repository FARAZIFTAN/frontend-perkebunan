// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.heading}>Halaman Tidak Ditemukan</h1>
        <p style={styles.text}>
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
          Silakan kembali ke halaman utama.
        </p>
        
        <div style={styles.plantContainer}>
          <div style={styles.soil}></div>
          <div style={styles.plantStages}>
            <div style={styles.seedStage} className="animated-seed">🌱</div>
            <div style={styles.sproutStage} className="animated-sprout">🌿</div>
            <div style={styles.plantStage} className="animated-plant">🌴</div>
            <div style={styles.treeStage} className="animated-tree">🌳</div>
          </div>
        </div>
        
        <Link to="/" style={styles.link}>
          <span style={styles.linkIcon}>🏡</span>
          Kembali ke Beranda
        </Link>
      </div>
      
      <style>{`
        @keyframes seed-appear {
          0%, 90% {
            opacity: 0;
            transform: translateY(30px);
          }
          10%, 20% {
            opacity: 1;
            transform: translateY(0);
          }
          25% {
            opacity: 0;
            transform: translateY(-10px);
          }
          30%, 100% {
            opacity: 0;
            transform: translateY(30px);
          }
        }
        
        @keyframes sprout-grow {
          0%, 20%, 60%, 100% {
            opacity: 0;
            transform: translateY(30px);
          }
          30%, 40% {
            opacity: 1;
            transform: translateY(0);
          }
          45% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        @keyframes plant-grow {
          0%, 40%, 80%, 100% {
            opacity: 0;
            transform: translateY(30px);
          }
          50%, 60% {
            opacity: 1;
            transform: translateY(0);
          }
          65% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        @keyframes tree-grow {
          0%, 60%, 100% {
            opacity: 0;
            transform: translateY(30px);
          }
          70%, 90% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animated-seed {
          animation: seed-appear 10s infinite;
        }
        
        .animated-sprout {
          animation: sprout-grow 10s infinite;
        }
        
        .animated-plant {
          animation: plant-grow 10s infinite;
        }
        
        .animated-tree {
          animation: tree-grow 10s infinite;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f8f5 0%, #e8f5e9 100%)',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '550px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px 30px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  errorCode: {
    fontSize: '100px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #2e7d32 0%, #1a472a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
    lineHeight: '1',
  },
  heading: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '600',
  },
  text: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  plantContainer: {
    position: 'relative',
    height: '160px',
    margin: '30px auto',
    width: '80px',
  },
  soil: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '20px',
    backgroundColor: '#795548',
    borderRadius: '50% 50% 0 0 / 20px',
  },
  plantStages: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  seedStage: {
    fontSize: '20px',
    transform: 'translateY(30px)',
    opacity: '0',
    position: 'absolute',
    bottom: '0',
  },
  sproutStage: {
    fontSize: '28px',
    transform: 'translateY(30px)',
    opacity: '0',
    position: 'absolute',
    bottom: '0',
  },
  plantStage: {
    fontSize: '36px',
    transform: 'translateY(30px)',
    opacity: '0',
    position: 'absolute',
    bottom: '0',
  },
  treeStage: {
    fontSize: '60px',
    transform: 'translateY(30px)',
    opacity: '0',
    position: 'absolute',
    bottom: '0',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a472a',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(26, 71, 42, 0.25)',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
  },
  linkIcon: {
    marginRight: '10px',
  },
};

export default NotFound;