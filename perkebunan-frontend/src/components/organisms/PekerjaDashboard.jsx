// src/components/organisms/PekerjaDashboard.jsx - Versi yang ditingkatkan
import React, { useState, useEffect } from 'react';
import { getPekerja, createPekerja, updatePekerja, deletePekerja } from '../../services/api';
import Button from '../../components/atoms/Button';
import FormInput from '../molecules/FormInput';
import './Dashboard.css';
import '../styles/advanced-animations.css'; // Import animasi tambahan

const PekerjaDashboard = () => {
  const [pekerja, setPekerja] = useState([]);
  const [formData, setFormData] = useState({ nama: '', posisi: '', kontak: '', alamat: '', gaji: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [animateForm, setAnimateForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [sortedPekerja, setSortedPekerja] = useState([]);

  // Fetch worker data from backend
  const fetchPekerja = async () => {
    setLoading(true);
    try {
      const data = await getPekerja();
      if (Array.isArray(data)) {
        setPekerja(data);
        console.log("Data pekerja berhasil dimuat:", data);
      } else {
        console.warn("Data pekerja tidak valid:", data);
        setPekerja([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pekerja:", error);
      setPekerja([]);
      showNotification("Gagal memuat data pekerja!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPekerja();
    // Animasi form masuk
    setTimeout(() => {
      setAnimateForm(true);
    }, 300);
  }, []);

  // Effect untuk pengurutan data
  useEffect(() => {
    let sortablePekerja = [...pekerja];
    
    if (sortConfig.key) {
      sortablePekerja.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
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
    
    setSortedPekerja(sortablePekerja);
  }, [pekerja, sortConfig]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'gaji' && value !== '') ? parseInt(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  // Format gaji dengan pemisah ribuan
  const formatGaji = (gaji) => {
    return gaji.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

  // Validate form before submission
  const isValidForm = () => {
    const { nama, posisi, kontak, alamat, gaji } = formData;
    if (!nama || !posisi || !kontak || !alamat || !gaji) {
      showNotification("Semua field wajib diisi!", "error");
      // Animasi getaran untuk form
      document.querySelector('.form-card').classList.add('shake-animation');
      setTimeout(() => {
        document.querySelector('.form-card').classList.remove('shake-animation');
      }, 500);
      return false;
    }
    
    if (isNaN(gaji) || gaji <= 0) {
      showNotification("Gaji harus berupa angka positif!", "error");
      return false;
    }
    
    return true;
  };

  // Add or update worker data
  const handleSubmit = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    try {
      const data = {
        nama: formData.nama,
        posisi: formData.posisi,
        kontak: formData.kontak,
        alamat: formData.alamat,
        gaji: parseInt(formData.gaji),
      };

      if (editing) {
        await updatePekerja(editId, data);
        showNotification("Data pekerja berhasil diperbarui! 👨‍🌾");
        setPekerja((prev) =>
          prev.map((item) => (item.id === editId ? { ...item, ...data } : item))
        );
      } else {
        const response = await createPekerja(data);
        showNotification("Data pekerja berhasil ditambahkan! 👨‍🌾");
        setPekerja((prev) => [...prev, { ...data, id: response.data?.id || Date.now() }]);
      }

      // Reset form and status
      setFormData({ nama: '', posisi: '', kontak: '', alamat: '', gaji: '' });
      setEditing(false);
    } catch (error) {
      console.error("Error saat menyimpan data pekerja:", error);
      showNotification("Gagal menyimpan data pekerja! Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit worker data
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id || item._id);
    setEditing(true);
    // Animasi scroll ke form
    const formElement = document.querySelector('.form-card');
    formElement.classList.add('highlight-animation');
    window.scrollTo({ top: formElement.offsetTop - 100, behavior: 'smooth' });
    setTimeout(() => {
      formElement.classList.remove('highlight-animation');
    }, 1500);
  };

  // Delete worker data with confirmation
  const handleDelete = async (id) => {
    const item = pekerja.find(item => item.id === id || item._id === id);
    
    if (window.confirm(`Yakin ingin menghapus data pekerja ${item?.nama || 'ini'}?`)) {
      try {
        setLoading(true);
        await deletePekerja(id);
        showNotification("Data pekerja berhasil dihapus! 🗑️");
        
        // Animasi penghapusan
        const rowElement = document.querySelector(`tr[data-id="${id}"]`);
        if (rowElement) {
          rowElement.classList.add('fade-out-row');
          setTimeout(() => {
            setPekerja((prev) => prev.filter((item) => (item.id !== id && item._id !== id)));
          }, 500);
        } else {
          setPekerja((prev) => prev.filter((item) => (item.id !== id && item._id !== id)));
        }
      } catch (error) {
        console.error("Gagal menghapus data pekerja:", error);
        showNotification("Gagal menghapus data pekerja!", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-animation">
          <h2>Manajemen Pekerja</h2>
        </div>
        <p>Kelola informasi pekerja di perkebunan Anda dengan efisien</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👨‍🌾</div>
          <div className="stat-value">{pekerja.length}</div>
          <div className="stat-label">Total Pekerja</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-value">
            {new Set(pekerja.map(item => item.posisi)).size}
          </div>
          <div className="stat-label">Jenis Posisi</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            Rp {formatGaji(pekerja.reduce((total, item) => total + (parseInt(item.gaji) || 0), 0))}
          </div>
          <div className="stat-label">Total Gaji</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-value">
            {new Set(pekerja.map(item => item.alamat)).size}
          </div>
          <div className="stat-label">Lokasi Berbeda</div>
        </div>
      </div>
      
      {/* Form Card */}
      <div className={`form-card ${animateForm ? 'form-animated' : ''}`}>
        <h3><span className="card-icon">{editing ? '✏️' : '➕'}</span> {editing ? 'Edit Data Pekerja' : 'Tambah Pekerja Baru'}</h3>
        <div className="form-grid">
          <FormInput 
            label="Nama Pekerja" 
            value={formData.nama} 
            onChange={handleChange} 
            name="nama" 
            required 
            icon={<span className="input-icon">👨‍🌾</span>}
            placeholder="Masukkan nama lengkap"
          />
          <FormInput 
            label="Posisi" 
            value={formData.posisi} 
            onChange={handleChange} 
            name="posisi" 
            required 
            icon={<span className="input-icon">💼</span>}
            placeholder="Contoh: Petani, Mandor, Admin, dll"
          />
          <FormInput 
            label="Kontak" 
            value={formData.kontak} 
            onChange={handleChange} 
            name="kontak" 
            required 
            icon={<span className="input-icon">📱</span>}
            placeholder="Nomor telepon"
            type="tel"
          />
          <FormInput 
            label="Alamat" 
            value={formData.alamat} 
            onChange={handleChange} 
            name="alamat" 
            required 
            icon={<span className="input-icon">📍</span>}
            placeholder="Alamat tempat tinggal"
          />
          <FormInput 
            label="Gaji (Rp)" 
            value={formData.gaji} 
            onChange={handleChange} 
            name="gaji" 
            type="number" 
            required 
            icon={<span className="input-icon">💰</span>}
            placeholder="Masukkan jumlah gaji tanpa titik/koma"
          />
        </div>
        <div className="form-actions">
          {editing && (
            <Button 
              text="Batal" 
              onClick={() => {
                setFormData({ nama: '', posisi: '', kontak: '', alamat: '', gaji: '' });
                setEditing(false);
              }} 
              variant="outline"
              icon={<span>❌</span>}
            />
          )}
          <Button 
            text={loading ? "Memproses..." : editing ? "Simpan Perubahan" : "Tambah Pekerja"} 
            onClick={handleSubmit} 
            disabled={loading} 
            variant={editing ? "success" : "primary"}
            loading={loading}
            icon={<span>{editing ? '💾' : '👨‍🌾'}</span>}
          />
        </div>
      </div>
      
      {/* Table Card */}
      <div className="table-card">
        <h3><span className="card-icon">📋</span> Daftar Pekerja</h3>
        {loading && !editing ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Sedang memuat data pekerja...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th><span className="th-icon">№</span> No</th>
                  <th 
                    className={`sortable ${sortConfig.key === 'nama' ? `sort-${sortConfig.direction}` : ''}`}
                    onClick={() => requestSort('nama')}
                  >
                    <span className="th-icon">👨‍🌾</span> Nama {getSortIcon('nama')}
                  </th>
                  <th 
                    className={`sortable ${sortConfig.key === 'posisi' ? `sort-${sortConfig.direction}` : ''}`}
                    onClick={() => requestSort('posisi')}
                  >
                    <span className="th-icon">💼</span> Posisi {getSortIcon('posisi')}
                  </th>
                  <th><span className="th-icon">📱</span> Kontak</th>
                  <th><span className="th-icon">📍</span> Alamat</th>
                  <th 
                    className={`sortable ${sortConfig.key === 'gaji' ? `sort-${sortConfig.direction}` : ''}`}
                    onClick={() => requestSort('gaji')}
                  >
                    <span className="th-icon">💰</span> Gaji {getSortIcon('gaji')}
                  </th>
                  <th><span className="th-icon">⚙️</span> Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedPekerja.length > 0 ? (
                  sortedPekerja.map((item, index) => {
                    const rowId = item.id || item._id;
                    
                    return (
                      <tr 
                        key={rowId}
                        data-id={rowId}
                      >
                        <td>{index + 1}</td>
                        <td className="cell-emphasis">{item.nama}</td>
                        <td>{item.posisi}</td>
                        <td>{item.kontak}</td>
                        <td>{item.alamat}</td>
                        <td>Rp {formatGaji(item.gaji)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              text="Edit" 
                              onClick={() => handleEdit(item)} 
                              variant="secondary" 
                              icon={<span className="btn-icon-anim">✏️</span>}
                              size="small"
                            />
                            <Button 
                              text="Hapus" 
                              onClick={() => handleDelete(rowId)} 
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
                        <span className="empty-state-icon">👨‍🌾</span>
                        <p className="empty-state-message">Belum ada data pekerja tersedia</p>
                        <p>Silakan tambahkan data pekerja baru menggunakan form di atas</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Menampilkan jumlah data */}
            {sortedPekerja.length > 0 && (
              <div className="table-footer">
                <div className="table-info">
                  <span className="table-count">Menampilkan {sortedPekerja.length} data pekerja</span>
                  {sortConfig.key && (
                    <span className="sort-info">
                      Diurutkan berdasarkan {sortConfig.key} ({sortConfig.direction === 'asc' ? 'naik' : 'turun'})
                    </span>
                  )}
                </div>
              </div>
            )}
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

export default PekerjaDashboard;