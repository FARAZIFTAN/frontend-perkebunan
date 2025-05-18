import React, { useState, useEffect } from 'react';
import { getPekerja, createPekerja, updatePekerja, deletePekerja } from '../../services/api';
import Button from '../../components/atoms/Button';
import FormInput from '../molecules/FormInput';

const PekerjaDashboard = () => {
  const [pekerja, setPekerja] = useState([]);
  const [formData, setFormData] = useState({ nama: '', posisi: '', kontak: '', alamat: '', gaji: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data pekerja dari backend
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPekerja();
  }, []);

  // Mengelola perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format gaji dengan pemisah ribuan
  const formatGaji = (gaji) => {
    return gaji.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Menambahkan atau memperbarui data pekerja
  const handleSubmit = async () => {
    try {
      // Validasi data
      if (!formData.nama || !formData.posisi || !formData.kontak || !formData.alamat || !formData.gaji) {
        alert("Semua field wajib diisi!");
        return;
      }

      const data = {
        nama: formData.nama,
        posisi: formData.posisi,
        kontak: formData.kontak,
        alamat: formData.alamat,
        gaji: parseInt(formData.gaji),
      };

      setLoading(true);
      if (editing) {
        await updatePekerja(editId, data);
        alert("Data pekerja berhasil diperbarui!");
        setPekerja((prev) =>
          prev.map((item) => (item.id === editId ? { ...item, ...data } : item))
        );
      } else {
        const response = await createPekerja(data);
        alert("Data pekerja berhasil ditambahkan!");
        setPekerja((prev) => [...prev, { ...data, id: response.data.id }]);
      }

      setFormData({ nama: '', posisi: '', kontak: '', alamat: '', gaji: '' });
      setEditing(false);
    } catch (error) {
      console.error("Error saat menyimpan data pekerja:", error);
      alert("Gagal menyimpan data pekerja!");
    } finally {
      setLoading(false);
    }
  };

  // Mengedit data pekerja
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setEditing(true);
  };

  // Menghapus data pekerja dengan konfirmasi
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pekerja ini?")) {
      try {
        setLoading(true);
        await deletePekerja(id);
        alert("Data pekerja berhasil dihapus!");
        setPekerja((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Gagal menghapus data pekerja:", error);
        alert("Gagal menghapus data pekerja!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Manajemen Pekerja</h2>
      <FormInput label="Nama" value={formData.nama} onChange={handleChange} name="nama" />
      <FormInput label="Posisi" value={formData.posisi} onChange={handleChange} name="posisi" />
      <FormInput label="Kontak" value={formData.kontak} onChange={handleChange} name="kontak" />
      <FormInput label="Alamat" value={formData.alamat} onChange={handleChange} name="alamat" />
      <FormInput label="Gaji" value={formData.gaji} onChange={handleChange} name="gaji" type="number" />
      <Button 
        text={loading ? "Memproses..." : editing ? "Update" : "Tambah"} 
        onClick={handleSubmit} 
        disabled={loading} 
        loading={loading} 
      />
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Kontak</th>
            <th>Alamat</th>
            <th>Gaji</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pekerja.map((item) => (
            <tr key={item.id || item._id}>
              <td>{item.nama}</td>
              <td>{item.posisi}</td>
              <td>{item.kontak}</td>
              <td>{item.alamat}</td>
              <td>Rp {formatGaji(item.gaji)}</td>
              <td>
                <Button text="Edit" onClick={() => handleEdit(item)} variant="secondary" />
                <Button text="Hapus" onClick={() => handleDelete(item.id || item._id)} variant="danger" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PekerjaDashboard;
