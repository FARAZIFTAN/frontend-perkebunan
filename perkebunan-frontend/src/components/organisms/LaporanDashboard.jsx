import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormInput from '../molecules/FormInput';
import { getLaporan, createLaporan, deleteLaporan } from '../../services/api';

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

  // Fungsi untuk mengambil data laporan dari backend
  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const data = await getLaporan();
      if (Array.isArray(data)) {
        setLaporan(data);
        console.log("Data laporan berhasil dimuat:", data);
      } else {
        console.warn("Data laporan tidak valid:", data);
        setLaporan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
      setLaporan([]);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLaporan();
  }, []);

  // Mengelola perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Menambahkan laporan baru
  const handleSubmit = async () => {
    try {
      // Validasi data
      if (!formData.nama_tanaman || !formData.jumlah_panen || !formData.nama_pekerja || !formData.tanggal || !formData.kualitas_panen) {
        alert("Semua field wajib diisi!");
        return;
      }

      setLoading(true);
      await createLaporan(formData);
      alert("Laporan berhasil ditambahkan!");

      // Tambahkan data ke state langsung tanpa fetch ulang
      setLaporan((prev) => [...prev, { ...formData, id: Date.now() }]);

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
      alert("Gagal menambahkan laporan!");
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
        alert("Laporan berhasil dihapus!");
        setLaporan((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Gagal menghapus laporan:", error);
        alert("Gagal menghapus laporan!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Manajemen Laporan</h2>
      <FormInput label="Nama Tanaman" name="nama_tanaman" value={formData.nama_tanaman} onChange={handleChange} />
      <FormInput label="Jumlah Panen" name="jumlah_panen" value={formData.jumlah_panen} onChange={handleChange} type="number" />
      <FormInput label="Nama Pekerja" name="nama_pekerja" value={formData.nama_pekerja} onChange={handleChange} />
      <FormInput label="Tanggal" name="tanggal" value={formData.tanggal} onChange={handleChange} type="date" />
      <FormInput label="Kualitas Panen" name="kualitas_panen" value={formData.kualitas_panen} onChange={handleChange} />
      <Button 
        text={loading ? "Memproses..." : "Tambah Laporan"} 
        onClick={handleSubmit} 
        disabled={loading} 
        loading={loading} 
      />

      <h3>Daftar Laporan</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nama Tanaman</th>
              <th>Jumlah Panen</th>
              <th>Nama Pekerja</th>
              <th>Tanggal</th>
              <th>Kualitas Panen</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {laporan.length > 0 ? (
              laporan.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama_tanaman}</td>
                  <td>{item.jumlah_panen} kg</td>
                  <td>{item.nama_pekerja}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.kualitas_panen}</td>
                  <td>
                    <Button 
                      text="Hapus" 
                      variant="danger" 
                      onClick={() => handleDelete(item.id)} 
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada laporan tersedia</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LaporanDashboard;
