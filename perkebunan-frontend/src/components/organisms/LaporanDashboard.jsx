// src/components/organisms/LaporanDashboard.jsx - Versi yang ditingkatkan
import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormInput from '../molecules/FormInput';
import { getLaporan, createLaporan, deleteLaporan } from '../../services/api';
import './Dashboard.css';
import './LaporanDashboard.css';
import '../styles/advanced-animations.css'; // Import animasi tambahan

const LaporanDashboard = () => {
  const [laporan, setLaporan] = useState([]);
  const [formData, setFormData] = useState({
    nama_tanaman: '',
    jumlah_panen: '',
    nama_pekerja: '',
    tanggal: '',
    kualitas_panen: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [animateForm, setAnimateForm] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filterField, setFilterField] = useState("nama_tanaman");
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'desc' });
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // Dapatkan data laporan dari backend
  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const data = await getLaporan();
      if (Array.isArray(data)) {
        setLaporan(data);
        console.log("Data laporan berhasil dimuat:", data);
        
        // Menyiapkan data untuk grafik
        prepareChartData(data);
      } else {
        console.warn("Data laporan tidak valid:", data);
        setLaporan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      setLaporan([]);
      showNotification("Gagal memuat data laporan!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Memuat data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLaporan();
    // Animasi form masuk
    setTimeout(() => {
      setAnimateForm(true);
    }, 300);
  }, []);

  // Fungsi untuk menyiapkan data grafik
  const prepareChartData = (data) => {
    // Kelompokkan berdasarkan tanaman
    const groupedByTanaman = data.reduce((acc, item) => {
      if (!acc[item.nama_tanaman]) {
        acc[item.nama_tanaman] = 0;
      }
      acc[item.nama_tanaman] += parseInt(item.jumlah_panen) || 0;
      return acc;
    }, {});
    
    // Konversi ke format untuk grafik
    const labels = Object.keys(groupedByTanaman);
    const values = Object.values(groupedByTanaman);
    
    setChartData({ labels, values });
  };

  // Menangani perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Menampilkan notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };
  
  // Validasi form sebelum mengirim
  const isValidForm = () => {
    const { nama_tanaman, jumlah_panen, nama_pekerja, tanggal, kualitas_panen } = formData;
    if (!nama_tanaman || !jumlah_panen || !nama_pekerja || !tanggal || !kualitas_panen) {
      showNotification("Semua field wajib diisi!", "error");
      // Animasi getaran untuk form
      document.querySelector('.form-card').classList.add('shake-animation');
      setTimeout(() => {
        document.querySelector('.form-card').classList.remove('shake-animation');
      }, 500);
      return false;
    }
    
    if (isNaN(jumlah_panen) || parseInt(jumlah_panen) <= 0) {
      showNotification("Jumlah panen harus berupa angka positif!", "error");
      return false;
    }
    
    return true;
  };

  // Menangani pengurutan kolom
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Mendapatkan ikon sortir berdasarkan status
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Menambahkan laporan baru
  const handleSubmit = async () => {
    if (!isValidForm()) return;
    
    try {
      setLoading(true);
      const response = await createLaporan(formData);
      showNotification("Laporan berhasil ditambahkan! 📊");
      
      // Tambahkan data baru ke state
      const newLaporan = {
        ...formData,
        id: response?.data?.id || Date.now()
      };
      setLaporan((prev) => [...prev, newLaporan]);
      
      // Perbarui data grafik
      prepareChartData([...laporan, newLaporan]);

      // Reset form setelah berhasil
      setFormData({
        nama_tanaman: '',
        jumlah_panen: '',
        nama_pekerja: '',
        tanggal: '',
        kualitas_panen: ''
      });
    } catch (error) {
      console.error("Gagal menambahkan laporan:", error);
      showNotification("Gagal menambahkan laporan!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Menghapus laporan dengan konfirmasi
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      try {
        setLoading(true);
        await deleteLaporan(id);
        showNotification("Laporan berhasil dihapus! 🗑️");
        
        // Animasi penghapusan
        const rowElement = document.querySelector(`tr[data-id="${id}"]`);
        if (rowElement) {
          rowElement.classList.add('fade-out-row');
          setTimeout(() => {
            const updatedLaporan = laporan.filter((item) => item.id !== id);
            setLaporan(updatedLaporan);
            // Perbarui data grafik
            prepareChartData(updatedLaporan);
          }, 500);
        } else {
          const updatedLaporan = laporan.filter((item) => item.id !== id);
          setLaporan(updatedLaporan);
          // Perbarui data grafik
          prepareChartData(updatedLaporan);
        }
      } catch (error) {
        console.error("Gagal menghapus laporan:", error);
        showNotification("Gagal menghapus laporan!", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const namaBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const tanggal = date.getDate();
    const bulan = namaBulan[date.getMonth()];
    const tahun = date.getFullYear();
    
    return `${tanggal} ${bulan} ${tahun}`;
  };

  // Filter dan sortir data laporan
  const getFilteredAndSortedLaporan = () => {
    // Filter data
    let filteredData = laporan;
    if (filterValue.trim() !== "") {
      filteredData = laporan.filter(item => {
        const fieldValue = String(item[filterField] || '').toLowerCase();
        return fieldValue.includes(filterValue.toLowerCase());
      });
    }
    
    // Sortir data
    filteredData.sort((a, b) => {
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
    
    return filteredData;
  };

  // Data yang telah difilter dan diurutkan
  const filteredAndSortedLaporan = getFilteredAndSortedLaporan();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-animation">
          <h2>Manajemen Laporan</h2>
        </div>
        <p>Dokumentasikan dan analisis hasil panen perkebunan Anda</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{laporan.length}</div>
          <div className="stat-label">Total Laporan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-value">
            {new Set(laporan.map(item => item.nama_tanaman)).size}
          </div>
          <div className="stat-label">Jenis Tanaman</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-value">
            {laporan.reduce((total, item) => total + (parseInt(item.jumlah_panen) || 0), 0).toLocaleString('id-ID')} kg
          </div>
          <div className="stat-label">Total Hasil Panen</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🌾</div>
          <div className="stat-value">
            {new Set(laporan.map(item => item.nama_pekerja)).size}
          </div>
          <div className="stat-label">Jumlah Pekerja</div>
        </div>
      </div>
      
      {/* Chart */}
      {chartData.labels.length > 0 && (
        <div className="chart-card">
          <h3><span className="card-icon">📈</span> Grafik Hasil Panen per Tanaman</h3>
          <div className="chart-container">
            {chartData.labels.map((label, index) => (
              <div className="chart-bar-container" key={label}>
                <div 
                  className="chart-bar" 
                  style={{ 
                    height: `${Math.min(100, (chartData.values[index] / Math.max(...chartData.values)) * 100)}%`
                  }}
                  data-value={chartData.values[index]}
                >
                  <span className="chart-value">{chartData.values[index]} kg</span>
                </div>
                <div className="chart-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Form Card */}
      <div className={`form-card ${animateForm ? 'form-animated' : ''}`}>
        <h3><span className="card-icon">➕</span> Tambah Laporan Baru</h3>
        <div className="form-grid">
          <FormInput 
            label="Nama Tanaman" 
            name="nama_tanaman" 
            value={formData.nama_tanaman} 
            onChange={handleChange} 
            required
            icon={<span className="input-icon">🌿</span>}
            placeholder="Masukkan nama tanaman"
          />
          <FormInput 
            label="Jumlah Panen (kg)" 
            name="jumlah_panen" 
            value={formData.jumlah_panen} 
            onChange={handleChange} 
            type="number" 
            required
            icon={<span className="input-icon">⚖️</span>}
            placeholder="Masukkan berat hasil panen"
          />
          <FormInput 
            label="Nama Pekerja" 
            name="nama_pekerja" 
            value={formData.nama_pekerja} 
            onChange={handleChange} 
            required
            icon={<span className="input-icon">👨‍🌾</span>}
            placeholder="Nama penanggung jawab"
          />
          <FormInput 
            label="Tanggal Panen" 
            name="tanggal" 
            value={formData.tanggal} 
            onChange={handleChange} 
            type="date" 
            required
            icon={<span className="input-icon">📅</span>}
          />
          <FormInput 
            label="Kualitas Panen" 
            name="kualitas_panen" 
            value={formData.kualitas_panen} 
            onChange={handleChange} 
            required
            icon={<span className="input-icon">⭐</span>}
            placeholder="Contoh: Baik, Sedang, Premium"
          />
        </div>
        <div className="form-actions">
          <Button 
            text={loading ? "Memproses..." : "Tambah Laporan"} 
            onClick={handleSubmit} 
            disabled={loading} 
            loading={loading} 
            variant="primary"
            icon={<span>📊</span>}
          />
        </div>
      </div>
      
      {/* Filter and Search */}
      <div className="filter-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Cari laporan..." 
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="search-input"
          />
          {filterValue && (
            <button 
              className="clear-search" 
              onClick={() => setFilterValue("")}
              title="Hapus pencarian"
            >
              ✖
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <label className="filter-label">Filter berdasarkan:</label>
          <select 
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="filter-select"
          >
            <option value="nama_tanaman">Nama Tanaman</option>
            <option value="nama_pekerja">Nama Pekerja</option>
            <option value="kualitas_panen">Kualitas</option>
          </select>
        </div>
      </div>
      
      {/* Table Card */}
      <div className="table-card">
        <h3><span className="card-icon">📋</span> Daftar Laporan</h3>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Sedang memuat data laporan...</p>
          </div>
        )}
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th><span className="th-icon">№</span> No</th>
                <th 
                  className={`sortable ${sortConfig.key === 'nama_tanaman' ? `sort-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('nama_tanaman')}
                >
                  <span className="th-icon">🌿</span> Nama Tanaman {getSortIcon('nama_tanaman')}
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'jumlah_panen' ? `sort-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('jumlah_panen')}
                >
                  <span className="th-icon">⚖️</span> Jumlah Panen {getSortIcon('jumlah_panen')}
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'nama_pekerja' ? `sort-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('nama_pekerja')}
                >
                  <span className="th-icon">👨‍🌾</span> Nama Pekerja {getSortIcon('nama_pekerja')}
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'tanggal' ? `sort-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('tanggal')}
                >
                  <span className="th-icon">📅</span> Tanggal {getSortIcon('tanggal')}
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'kualitas_panen' ? `sort-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('kualitas_panen')}
                >
                  <span className="th-icon">⭐</span> Kualitas {getSortIcon('kualitas_panen')}
                </th>
                <th><span className="th-icon">⚙️</span> Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLaporan.length > 0 ? (
                filteredAndSortedLaporan.map((item, index) => (
                  <tr key={item.id || index} data-id={item.id}>
                    <td>{index + 1}</td>
                    <td className="cell-emphasis">{item.nama_tanaman}</td>
                    <td>{item.jumlah_panen} kg</td>
                    <td>{item.nama_pekerja}</td>
                    <td>{formatDate(item.tanggal)}</td>
                    <td>{item.kualitas_panen}</td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          text="Hapus" 
                          onClick={() => handleDelete(item.id)} 
                          variant="danger" 
                          icon={<span className="btn-icon-anim">🗑️</span>}
                          size="small"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="7">
                    <div className="empty-state">
                      <span className="empty-state-icon">📊</span>
                      <p className="empty-state-message">
                        {filterValue ? "Tidak ada laporan yang sesuai dengan pencarian" : "Belum ada data laporan tersedia"}
                      </p>
                      <p>
                        {filterValue ? "Coba ubah kata kunci pencarian" : "Silakan tambahkan laporan baru menggunakan form di atas"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Menampilkan jumlah data */}
          {filteredAndSortedLaporan.length > 0 && (
            <div className="table-footer">
              <div className="table-info">
                <span className="table-count">
                  {filterValue 
                    ? `Menampilkan ${filteredAndSortedLaporan.length} dari ${laporan.length} laporan` 
                    : `Menampilkan ${filteredAndSortedLaporan.length} laporan`}
                </span>
                {sortConfig.key && (
                  <span className="sort-info">
                    Diurutkan berdasarkan {sortConfig.key} ({sortConfig.direction === 'asc' ? 'naik' : 'turun'})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : '⚠️'}
          </span>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default LaporanDashboard;