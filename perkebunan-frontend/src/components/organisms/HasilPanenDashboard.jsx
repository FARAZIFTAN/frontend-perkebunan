import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormInput from '../molecules/FormInput';
import { getHasilPanen, createHasilPanen, updateHasilPanen, deleteHasilPanen } from '../../services/api';
import './Dashboard.css';

const HasilPanenDashboard = () => {
  // State management
  const [hasilPanen, setHasilPanen] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    jumlah: '',
    tanggal: '',
    lokasi: '',
    kualitas: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [filterValue, setFilterValue] = useState("");
  const [filterField, setFilterField] = useState("nama");
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'desc' });
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // Fetch data
  const fetchHasilPanen = async () => {
    setLoading(true);
    try {
      const data = await getHasilPanen();
      if (Array.isArray(data)) {
        setHasilPanen(data);
        prepareChartData(data);
        console.log("Data hasil panen berhasil dimuat:", data);
      } else {
        console.warn("Data hasil panen tidak valid:", data);
        setHasilPanen([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data hasil panen:", error);
      setHasilPanen([]);
      showNotification("Gagal memuat data hasil panen!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHasilPanen();
  }, []);

  // Chart data preparation
  const prepareChartData = (data) => {
    const groupedByTanaman = data.reduce((acc, item) => {
      if (!acc[item.nama]) {
        acc[item.nama] = 0;
      }
      acc[item.nama] += parseInt(item.jumlah) || 0;
      return acc;
    }, {});
    
    setChartData({
      labels: Object.keys(groupedByTanaman),
      values: Object.values(groupedByTanaman)
    });
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  // Form validation
  const isValidForm = () => {
    const { nama, jumlah, tanggal, lokasi, kualitas } = formData;
    if (!nama || !jumlah || !tanggal || !lokasi || !kualitas) {
      showNotification("Semua field wajib diisi!", "error");
      return false;
    }
    
    if (isNaN(jumlah) || parseInt(jumlah) <= 0) {
      showNotification("Jumlah panen harus berupa angka positif!", "error");
      return false;
    }
    
    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!isValidForm()) return;
    
    try {
      setLoading(true);
      const response = await createHasilPanen(formData);
      showNotification("Data hasil panen berhasil ditambahkan! 🌾");
      
      const newHasilPanen = {
        ...formData,
        id: response?.data?.id || Date.now()
      };
      setHasilPanen(prev => [...prev, newHasilPanen]);
      prepareChartData([...hasilPanen, newHasilPanen]);

      // Reset form
      setFormData({
        nama: '',
        jumlah: '',
        tanggal: '',
        lokasi: '',
        kualitas: ''
      });
    } catch (error) {
      console.error("Gagal menambahkan hasil panen:", error);
      showNotification("Gagal menambahkan data!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        setLoading(true);
        await deleteHasilPanen(id);
        showNotification("Data hasil panen berhasil dihapus! 🗑️");
        
        const updatedHasilPanen = hasilPanen.filter(item => item.id !== id);
        setHasilPanen(updatedHasilPanen);
        prepareChartData(updatedHasilPanen);
      } catch (error) {
        console.error("Gagal menghapus hasil panen:", error);
        showNotification("Gagal menghapus data!", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Sorting handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Format functions
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Filter and sort data
  const getFilteredAndSortedHasilPanen = () => {
    let filteredData = hasilPanen;
    
    if (filterValue.trim() !== "") {
      filteredData = hasilPanen.filter(item => {
        const fieldValue = String(item[filterField] || '').toLowerCase();
        return fieldValue.includes(filterValue.toLowerCase());
      });
    }
    
    filteredData.sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (sortConfig.key === 'tanggal') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filteredData;
  };

  const filteredAndSortedHasilPanen = getFilteredAndSortedHasilPanen();

  // Quality indicator
  const getQualityIndicator = (quality) => {
    const qualityLower = quality.toLowerCase();
    if (qualityLower.includes('baik') || qualityLower.includes('premium')) {
      return { icon: '🌟', className: 'status-good' };
    } else if (qualityLower.includes('sedang') || qualityLower.includes('normal')) {
      return { icon: '✓', className: 'status-medium' };
    } else {
      return { icon: '⚠️', className: 'status-poor' };
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header section */}
      <div className="dashboard-header">
        <h2>Manajemen Hasil Panen</h2>
        <p>Catat dan kelola hasil panen perkebunan Anda</p>
      </div>

      {/* Statistics section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{hasilPanen.length}</div>
          <div className="stat-label">Total Catatan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-value">
            {formatNumber(hasilPanen.reduce((total, item) => total + (parseInt(item.jumlah) || 0), 0))} kg
          </div>
          <div className="stat-label">Total Panen</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-value">
            {new Set(hasilPanen.map(item => item.lokasi)).size}
          </div>
          <div className="stat-label">Lokasi</div>
        </div>
      </div>

      {/* Form section */}
      <div className="form-card">
        <h3><span className="card-icon">➕</span> Tambah Hasil Panen</h3>
        <div className="form-grid">
          <FormInput 
            label="Nama Tanaman"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            icon={<span>🌿</span>}
            placeholder="Masukkan nama tanaman"
          />
          <FormInput 
            label="Jumlah Panen (kg)"
            name="jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            type="number"
            required
            icon={<span>⚖️</span>}
            placeholder="Masukkan jumlah dalam kg"
          />
          <FormInput 
            label="Tanggal Panen"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            type="date"
            required
            icon={<span>📅</span>}
          />
          <FormInput 
            label="Lokasi Panen"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            required
            icon={<span>📍</span>}
            placeholder="Masukkan lokasi panen"
          />
          <FormInput 
            label="Kualitas Panen"
            name="kualitas"
            value={formData.kualitas}
            onChange={handleChange}
            required
            icon={<span>⭐</span>}
            placeholder="Contoh: Baik, Sedang, Premium"
          />
        </div>
        <div className="form-actions">
          <Button 
            text={loading ? "Memproses..." : "Tambah Hasil Panen"}
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            variant="primary"
            icon={<span>🌾</span>}
          />
        </div>
      </div>

      {/* Filter section */}
      <div className="filter-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text"
            placeholder="Cari hasil panen..."
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
      </div>

      {/* Table section */}
      <div className="table-card">
        <h3><span className="card-icon">📋</span> Daftar Hasil Panen</h3>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Memuat data...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th onClick={() => requestSort('nama')}>
                    Nama {getSortIcon('nama')}
                  </th>
                  <th onClick={() => requestSort('jumlah')}>
                    Jumlah {getSortIcon('jumlah')}
                  </th>
                  <th onClick={() => requestSort('tanggal')}>
                    Tanggal {getSortIcon('tanggal')}
                  </th>
                  <th onClick={() => requestSort('lokasi')}>
                    Lokasi {getSortIcon('lokasi')}
                  </th>
                  <th onClick={() => requestSort('kualitas')}>
                    Kualitas {getSortIcon('kualitas')}
                  </th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedHasilPanen.length > 0 ? (
                  filteredAndSortedHasilPanen.map((item, index) => {
                    const quality = getQualityIndicator(item.kualitas);
                    return (
                      <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{formatNumber(item.jumlah)} kg</td>
                        <td>{formatDate(item.tanggal)}</td>
                        <td>{item.lokasi}</td>
                        <td>
                          <span className={`status-indicator ${quality.className}`}>
                            {quality.icon} {item.kualitas}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              text="Hapus"
                              onClick={() => handleDelete(item.id)}
                              variant="danger"
                              icon={<span>🗑️</span>}
                              size="small"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <span className="empty-state-icon">🌾</span>
                        <p>Belum ada data hasil panen</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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

export default HasilPanenDashboard;