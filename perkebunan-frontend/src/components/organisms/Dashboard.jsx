import React, { useState, useEffect } from 'react';
import { getTanaman, createTanaman, updateTanaman, deleteTanaman } from '../../services/api';
import TanamanTable from './TanamanTable';
import Button from '../../components/atoms/Button';
import FormInput from '../molecules/FormInput';

const Dashboard = () => {
  const [tanaman, setTanaman] = useState([]);
  const [formData, setFormData] = useState({ nama: '', lokasi: '', jumlah: '', tanggal: '', kualitas: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data tanaman dari backend
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
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchTanaman();
  }, []);

  // Fungsi untuk menangani perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'jumlah' && value !== '') ? parseInt(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Validasi form sebelum submit
  const isValidForm = () => {
    const { nama, lokasi, jumlah, tanggal, kualitas } = formData;
    if (!nama || !lokasi || !jumlah || !tanggal || !kualitas) {
      alert("Semua field wajib diisi!");
      return false;
    }
    if (isNaN(jumlah) || jumlah <= 0) {
      alert("Jumlah harus berupa angka positif!");
      return false;
    }
    return true;
  };

  // Fungsi untuk menambahkan atau mengupdate data tanaman
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
        alert("Data berhasil diperbarui!");
        setTanaman((prev) =>
          prev.map((item) => (item.id === editId ? { ...item, ...data } : item))
        );
      } else {
        const response = await createTanaman(data);
        alert("Data berhasil ditambahkan!");
        setTanaman((prev) => [...prev, { ...data, id: response.id }]);
      }

      // Reset form dan status
      setFormData({ nama: '', lokasi: '', jumlah: '', tanggal: '', kualitas: '' });
      setEditing(false);
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit data tanaman
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setEditing(true);
  };

  // Fungsi untuk menghapus data tanaman dengan konfirmasi
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        setLoading(true);
        await deleteTanaman(id);
        alert("Data tanaman berhasil dihapus!");
        setTanaman((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Gagal menghapus data tanaman:", error);
        alert("Gagal menghapus data tanaman!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Manajemen Tanaman</h2>
      <div>
        <FormInput label="Nama" value={formData.nama} onChange={handleChange} name="nama" />
        <FormInput label="Lokasi" value={formData.lokasi} onChange={handleChange} name="lokasi" />
        <FormInput label="Jumlah" value={formData.jumlah} onChange={handleChange} name="jumlah" type="number" />
        <FormInput label="Tanggal" value={formData.tanggal} onChange={handleChange} name="tanggal" type="date" />
        <FormInput label="Kualitas" value={formData.kualitas} onChange={handleChange} name="kualitas" />
        <Button text={loading ? "Memproses..." : editing ? "Update" : "Tambah"} onClick={handleSubmit} disabled={loading} />
      </div>
      {loading ? <p>Loading data...</p> : null}
      <TanamanTable tanaman={tanaman} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
