// src/components/organisms/TanamanTable.jsx
import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import './TanamanTable.css';

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Daftar nama bulan dalam bahasa Indonesia
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  // Daftar nama hari dalam bahasa Indonesia
  const namaHari = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  
  const hari = namaHari[date.getDay()];
  const tanggal = date.getDate();
  const bulan = namaBulan[date.getMonth()];
  const tahun = date.getFullYear();
  
  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
};

// Fungsi untuk mendapatkan ikon dan kelas kualitas
const getQualityIndicator = (quality) => {
  let icon = '';
  let className = '';
  let label = '';
  
  const qualityLower = quality.toLowerCase();
  
  if (qualityLower.includes('baik') || qualityLower.includes('bagus') || qualityLower.includes('premium')) {
    icon = '🌟';
    className = 'status-good';
    label = 'Kualitas Premium';
  } else if (qualityLower.includes('sedang') || qualityLower.includes('normal') || qualityLower.includes('standar')) {
    icon = '✓';
    className = 'status-medium';
    label = 'Kualitas Standar';
  } else if (qualityLower.includes('buruk') || qualityLower.includes('rendah') || qualityLower.includes('kurang')) {
    icon = '⚠️';
    className = 'status-poor';
    label = 'Kualitas Rendah';
  } else {
    icon = '❓';
    className = '';
    label = 'Kualitas Tidak Diketahui';
  }
  
  return { icon, className, label };
};

const TanamanTable = ({ tanaman, handleEdit, handleDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [sortedTanaman, setSortedTanaman] = useState([]);
  const [hover, setHover] = useState(null);

  // Efek sortir
  useEffect(() => {
    let sortableTanaman = [...tanaman];
    
    if (sortConfig.key) {
      sortableTanaman.sort((a, b) => {
        // Konversi nilai untuk perbandingan yang tepat
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];
        
        // Konversi string menjadi lowercase untuk perbandingan string
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        // Konversi tanggal menjadi objek Date untuk perbandingan
        if (sortConfig.key === 'tanggal') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setSortedTanaman(sortableTanaman);
  }, [tanaman, sortConfig]);

  // Menangani pengurutan kolom
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Menangani efek highlight
  const handleRowHighlight = (id) => {
    setHighlightedRow(id);
    setTimeout(() => {
      setHighlightedRow(null);
    }, 2000);
  };

  // Mendapatkan ikon sortir berdasarkan status
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th><span className="th-icon">№</span> No</th>
            <th 
              className={`sortable ${sortConfig.key === 'nama' ? `sort-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('nama')}
            >
              <span className="th-icon">🌱</span> Nama Tanaman {getSortIcon('nama')}
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'lokasi' ? `sort-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('lokasi')}
            >
              <span className="th-icon">📍</span> Lokasi {getSortIcon('lokasi')}
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'jumlah' ? `sort-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('jumlah')}
            >
              <span className="th-icon">🔢</span> Jumlah {getSortIcon('jumlah')}
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'tanggal' ? `sort-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('tanggal')}
            >
              <span className="th-icon">📅</span> Tanggal {getSortIcon('tanggal')}
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'kualitas' ? `sort-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('kualitas')}
            >
              <span className="th-icon">⭐</span> Kualitas {getSortIcon('kualitas')}
            </th>
            <th><span className="th-icon">⚙️</span> Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedTanaman.length > 0 ? (
            sortedTanaman.map((item, index) => {
              const quality = getQualityIndicator(item.kualitas);
              const rowId = item.id || item._id;
              
              return (
                <tr 
                  key={rowId} 
                  className={highlightedRow === rowId ? 'highlight-row' : ''}
                  data-id={rowId}
                  onMouseEnter={() => setHover(rowId)}
                  onMouseLeave={() => setHover(null)}
                >
                  <td>{index + 1}</td>
                  <td className="cell-emphasis">{item.nama}</td>
                  <td>{item.lokasi}</td>
                  <td>{formatNumber(item.jumlah)}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td>
                    <div className="quality-indicator-wrapper" title={quality.label}>
                      <span className={`status-indicator ${quality.className}`}></span>
                      <span className="quality-text">{quality.icon} {item.kualitas}</span>
                      
                      {/* Tooltip saat hover */}
                      {hover === rowId && (
                        <div className="quality-tooltip">
                          {quality.label}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        text="Edit" 
                        onClick={() => {
                          handleEdit(item);
                          handleRowHighlight(rowId);
                        }} 
                        variant="secondary" 
                        icon={<span className="btn-icon-anim">✏️</span>}
                        size="small"
                      />
                      <Button 
                        text="Hapus" 
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus tanaman ${item.nama}?`)) {
                            handleDelete(rowId);
                          }
                        }} 
                        variant="danger" 
                        icon={<span className="btn-icon-anim">🗑️</span>}
                        size="small"
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="empty-row">
              <td colSpan="7">
                <div className="empty-state">
                  <span className="empty-state-icon">🌱</span>
                  <p className="empty-state-message">Belum ada data tanaman tersedia</p>
                  <p>Silakan tambahkan data tanaman baru menggunakan form di atas</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Menampilkan jumlah data */}
      {sortedTanaman.length > 0 && (
        <div className="table-footer">
          <div className="table-info">
            <span className="table-count">Menampilkan {sortedTanaman.length} data tanaman</span>
            {sortConfig.key && (
              <span className="sort-info">
                Diurutkan berdasarkan {sortConfig.key} ({sortConfig.direction === 'asc' ? 'naik' : 'turun'})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TanamanTable;