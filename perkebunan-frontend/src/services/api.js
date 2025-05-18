import axios from 'axios';

// Inisialisasi Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi menangani respons sukses
const handleSuccess = (response) => {
  if (response && response.data) {
    console.log("Respons dari server:", response.data);

    // Jika respons data berupa array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Jika data berada di dalam objek dengan format { data: [] }
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // Jika data berada di dalam objek dengan format { data: {} }
    if (response.data.data && typeof response.data.data === 'object') {
      return response.data.data;
    }

    // Jika data langsung berupa objek tanpa pembungkus data
    if (typeof response.data === 'object') {
      return response.data;
    }

    console.warn("Format data tidak dikenali, mengembalikan data mentah.");
    return response.data;
  }

  console.warn("Respons kosong dari server.");
  return [];
};

// Fungsi menangani error secara terstruktur
const handleError = (error) => {
  if (error.response) {
    console.error("Error dari server:", error.response.data);
    alert(`Error: ${error.response.data.message || "Terjadi kesalahan pada server"}`);
    return { status: "error", message: error.response.data.message || "Error pada server" };
  } else if (error.request) {
    console.error("Tidak ada respons dari server:", error.request);
    alert("Server tidak merespons, periksa koneksi Anda!");
    return { status: "error", message: "Server tidak merespons" };
  } else {
    console.error("Kesalahan umum:", error.message);
    alert(`Error: ${error.message}`);
    return { status: "error", message: error.message };
  }
};

// Fungsi CRUD Generik
const createAPI = (endpoint) => {
  return {
    getAll: () => api.get(`/${endpoint}`).then(handleSuccess).catch(handleError),
    create: (data) => api.post(`/${endpoint}`, data).then(handleSuccess).catch(handleError),
    update: (id, data) => api.put(`/${endpoint}/${id}`, data).then(handleSuccess).catch(handleError),
    delete: (id) => api.delete(`/${endpoint}/${id}`).then(handleSuccess).catch(handleError),
  };
};

// CRUD untuk entitas Tanaman
export const getTanaman = () => createAPI('tanaman').getAll();
export const createTanaman = (data) => createAPI('tanaman').create(data);
export const updateTanaman = (id, data) => createAPI('tanaman').update(id, data);
export const deleteTanaman = (id) => createAPI('tanaman').delete(id);

// CRUD untuk entitas Hasil Panen
export const getHasilPanen = () => createAPI('hasilpanen').getAll();
export const createHasilPanen = (data) => createAPI('hasilpanen').create(data);
export const updateHasilPanen = (id, data) => createAPI('hasilpanen').update(id, data);
export const deleteHasilPanen = (id) => createAPI('hasilpanen').delete(id);

// CRUD untuk entitas Pekerja
export const getPekerja = () => createAPI('pekerja').getAll();
export const createPekerja = (data) => createAPI('pekerja').create(data);
export const updatePekerja = (id, data) => createAPI('pekerja').update(id, data);
export const deletePekerja = (id) => createAPI('pekerja').delete(id);

// CRUD untuk entitas Laporan
export const getLaporan = () => createAPI('laporan').getAll();
export const createLaporan = (data) => createAPI('laporan').create(data);
export const deleteLaporan = (id) => createAPI('laporan').delete(id);
