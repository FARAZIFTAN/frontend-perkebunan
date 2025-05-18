// src/components/organisms/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getTanaman, createTanaman, updateTanaman, deleteTanaman } from '../../services/api';
import TanamanTable from './TanamanTable';
import Button from '../../components/atoms/Button';
import FormInput from '../molecules/FormInput';
import './Dashboard.css';
import '../styles/advanced-animations.css'; // Import animasi tambahan

const Dashboard = () => {
  const [tanaman, setTanaman] = useState([]);
  const [formData, setFormData] = useState({ nama: '', lokasi: '', jumlah: '', tanggal: '', kualitas: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [animateForm, setAnimateForm] = useState(false);

  // Fetch plants data from backend
  const fetchTanaman = async () => {
    setLoading(true);
    try {
      const data = await getTanaman();
      if (Array.isArray(data)) {
        setTanaman(data);
        console.log("Data tanaman berhasil dimuat:", data);
      } else {
        console.warn("Data tanaman tidak valid:", data);
        setTanaman([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data tanaman:", error);
      setTanaman([]);
      showNotification("Gagal memuat data tanaman!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTanaman();
    // Animasi form masuk
    setTimeout(() => {
      setAnimateForm(true);
    }, 300);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'jumlah' && value !== '') ? parseInt(value) : value;
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

  // Validate form before submission
  const isValidForm = () => {
    const { nama, lokasi, jumlah, tanggal, kualitas } = formData;
    if (!nama || !lokasi || !jumlah || !tanggal || !kualitas) {
      showNotification("Semua field wajib diisi!", "error");
      // Animasi getaran untuk form
      document.querySelector('.form-card').classList.add('shake-animation');
      setTimeout(() => {
        document.querySelector('.form-card').classList.remove('shake-animation');
      }, 500);
      return false;
    }
    if (isNaN(jumlah) || jumlah <= 0) {
      showNotification("Jumlah harus berupa angka positif!", "error");
      return false;
    }
    return true;
  };

  // Add or update plant data
  const handleSubmit = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    try {
      const data = {
        nama: formData.nama,
        jumlah: parseInt(formData.jumlah),
        tanggal: formData.tanggal,
        lokasi: formData.lokasi,
        kualitas: formData.kualitas,
      };

      if (editing) {
        await updateTanaman(editId, data);
        showNotification("Data berhasil diperbarui! 🌱");
        setTanaman((prev) =>
          prev.map((item) => (item.id === editId ? { ...item, ...data } : item))
        );
      } else {
        const response = await createTanaman(data);
        showNotification("Data berhasil ditambahkan! 🌱");
        setTanaman((prev) => [...prev, { ...data, id: response.id }]);
      }

      // Reset form and status
      setFormData({ nama: '', lokasi: '', jumlah: '', tanggal: '', kualitas: '' });
      setEditing(false);
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      showNotification("Gagal menyimpan data! Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit plant data
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setEditing(true);
    // Animasi scroll ke form
    const formElement = document.querySelector('.form-card');
    formElement.classList.add('highlight-animation');
    window.scrollTo({ top: formElement.offsetTop - 100, behavior: 'smooth' });
    setTimeout(() => {
      formElement.classList.remove('highlight-animation');
    }, 1500);
  };

  // Delete plant data with confirmation
  const handleDelete = async (id) => {
    const item = tanaman.find(item => item.id === id || item._id === id);
    
    if (window.confirm(`Yakin ingin menghapus tanaman ${item?.nama || 'ini'}?`)) {
      try {
        setLoading(true);
        await deleteTanaman(id);
        showNotification("Data tanaman berhasil dihapus! 🗑️");
        
        // Animasi penghapusan
        const rowElement = document.querySelector(`tr[data-id="${id}"]`);
        if (rowElement) {
          rowElement.classList.add('fade-out-row');
          setTimeout(() => {
            setTanaman((prev) => prev.filter((item) => (item.id !== id && item._id !== id)));
          }, 500);
        } else {
          setTanaman((prev) => prev.filter((item) => (item.id !== id && item._id !== id)));
        }
      } catch (error) {
        console.error("Gagal menghapus data tanaman:", error);
        showNotification("Gagal menghapus data tanaman!", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate summary stats
  const totalJumlah = tanaman.reduce((total, item) => total + (parseInt(item.jumlah) || 0), 0);
  const uniqueLocations = [...new Set(tanaman.map(item => item.lokasi))];
  const kualitasBaik = tanaman.filter(item => 
    item.kualitas.toLowerCase().includes('baik') || 
    item.kualitas.toLowerCase().includes('premium')
  ).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-animation">
          <h2>Manajemen Tanaman</h2>
        </div>
        <p>Kelola informasi tanaman di perkebunan Anda dengan mudah dan efisien</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-value">{tanaman.length}</div>
          <div className="stat-label">Total Jenis Tanaman</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">
            {totalJumlah.toLocaleString('id-ID')}
          </div>
          <div className="stat-label">Total Jumlah Tanaman</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-value">
            {uniqueLocations.length}
          </div>
          <div className="stat-label">Lokasi Perkebunan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">
            {kualitasBaik}
          </div>
          <div className="stat-label">Tanaman Kualitas Baik</div>
        </div>
      </div>
      
      {/* Form Card */}
      <div className={`form-card ${animateForm ? 'form-animated' : ''}`}>
        <h3><span className="card-icon">{editing ? '✏️' : '➕'}</span> {editing ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h3>
        <div className="form-grid">
          <FormInput 
            label="Nama Tanaman" 
            value={formData.nama} 
            onChange={handleChange} 
            name="nama" 
            required 
            icon={<span className="input-icon">🌿</span>}
            placeholder="Contoh: Padi, Jagung, Ketela, dll"
          />
          <FormInput 
            label="Lokasi Penanaman" 
            value={formData.lokasi} 
            onChange={handleChange} 
            name="lokasi" 
            required 
            icon={<span className="input-icon">📍</span>}
            placeholder="Contoh: Lahan A, Kebun Utara, dll"
          />
          <FormInput 
            label="Jumlah Tanaman" 
            value={formData.jumlah} 
            onChange={handleChange} 
            name="jumlah" 
            type="number" 
            required 
            icon={<span className="input-icon">🔢</span>}
            placeholder="Masukkan jumlah dalam angka"
          />
          <FormInput 
            label="Tanggal Tanam" 
            value={formData.tanggal} 
            onChange={handleChange} 
            name="tanggal" 
            type="date" 
            required 
            icon={<span className="input-icon">📅</span>}
          />
          <FormInput 
            label="Kualitas Tanaman" 
            value={formData.kualitas} 
            onChange={handleChange} 
            name="kualitas" 
            required 
            icon={<span className="input-icon">⭐</span>}
            placeholder="Contoh: Baik, Sedang, Premium, dll"
          />
        </div>
        <div className="form-actions">
          {editing && (
            <Button 
              text="Batal" 
              onClick={() => {
                setFormData({ nama: '', lokasi: '', jumlah: '', tanggal: '', kualitas: '' });
                setEditing(false);
              }} 
              variant="outline"
              icon={<span>❌</span>}
            />
          )}
          <Button 
            text={loading ? "Memproses..." : editing ? "Simpan Perubahan" : "Tambah Tanaman"} 
            onClick={handleSubmit} 
            disabled={loading} 
            variant={editing ? "success" : "primary"}
            loading={loading}
            icon={<span>{editing ? '💾' : '🌱'}</span>}
          />
        </div>
      </div>
      
      {/* Table Card */}
      <div className="table-card">
        <h3><span className="card-icon">📋</span> Daftar Tanaman</h3>
        {loading && !editing ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Sedang memuat data tanaman...</p>
          </div>
        ) : (
          <TanamanTable tanaman={tanaman} handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>
      
      {/* Notification dengan animasi */}
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

export default Dashboard;