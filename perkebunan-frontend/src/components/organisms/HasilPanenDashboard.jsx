import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormInput from '../molecules/FormInput';
import { getHasilPanen, createHasilPanen, updateHasilPanen, deleteHasilPanen } from '../../services/api';

const HasilPanenDashboard = () => {
  const [hasilPanen, setHasilPanen] = useState([]);
  const [formData, setFormData] = useState({ nama: '', jumlah: '', tanggal: '', lokasi: '', kualitas: '' });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mengambil data hasil panen dari server
  const fetchHasilPanen = async () => {
    setLoading(true);
    try {
      const data = await getHasilPanen();
      if (Array.isArray(data)) {
        setHasilPanen(data);
        console.log("Data hasil panen berhasil dimuat:", data);
      } else {
        console.warn("Data hasil panen tidak valid:", data);
        setHasilPanen([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data hasil panen:", error);
      setHasilPanen([]);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchHasilPanen();
  }, []);

  // Mengelola perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Menambah atau memperbarui data hasil panen
  const handleSubmit = async () => {
    try {
      // Validasi data
      if (!formData.nama || !formData.jumlah || !formData.tanggal || !formData.lokasi || !formData.kualitas) {
        alert("Semua field wajib diisi!");
        return;
      }

      setLoading(true);
      if (editing) {
        await updateHasilPanen(editId, formData);
        alert("Data berhasil diperbarui!");
        setHasilPanen((prev) => prev.map((item) => (item.id === editId ? { ...item, ...formData } : item)));
      } else {
        const response = await createHasilPanen(formData);
        alert("Data berhasil ditambahkan!");
        setHasilPanen((prev) => [...prev, { ...formData, id: response.data.id }]);
      }

      // Reset form setelah operasi berhasil
      setFormData({ nama: '', jumlah: '', tanggal: '', lokasi: '', kualitas: '' });
      setEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan data hasil panen:", error);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  // Mengedit data hasil panen
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setEditing(true);
  };

  // Menghapus data hasil panen dengan konfirmasi
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteHasilPanen(id);
        alert("Data hasil panen berhasil dihapus!");
        setHasilPanen((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Gagal menghapus data hasil panen:", error);
        alert("Gagal menghapus data!");
      }
    }
  };

  return (
    <div>
      <h2>Manajemen Hasil Panen</h2>
      <div>
        <FormInput label="Nama" name="nama" value={formData.nama} onChange={handleChange} />
        <FormInput label="Jumlah" name="jumlah" value={formData.jumlah} onChange={handleChange} type="number" />
        <FormInput label="Tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} type="date" />
        <FormInput label="Lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} />
        <FormInput label="Kualitas" name="kualitas" value={formData.kualitas} onChange={handleChange} />
        <Button 
          text={loading ? "Memproses..." : editing ? "Update" : "Tambah"} 
          onClick={handleSubmit} 
          disabled={loading} 
          loading={loading}
        />
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table className="hasil-panen-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Tanggal</th>
              <th>Lokasi</th>
              <th>Kualitas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasilPanen.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.jumlah} kg</td>
                <td>{item.tanggal}</td>
                <td>{item.lokasi}</td>
                <td>{item.kualitas}</td>
                <td>
                  <Button text="Edit" onClick={() => handleEdit(item)} variant="secondary" />
                  <Button text="Hapus" onClick={() => handleDelete(item.id)} variant="danger" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HasilPanenDashboard;
