import React from 'react';
import Button from '../atoms/Button';

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const TanamanTable = ({ tanaman, handleEdit, handleDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Tanaman</th>
            <th>Lokasi</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
            <th>Kualitas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tanaman.length > 0 ? (
            tanaman.map((item, index) => (
              <tr key={item.id || item._id}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.lokasi}</td>
                <td>{formatNumber(item.jumlah)}</td>
                <td>{formatDate(item.tanggal)}</td>
                <td>{item.kualitas}</td>
                <td>
                  <Button 
                    text="Edit" 
                    onClick={() => handleEdit(item)} 
                    variant="secondary" 
                  />
                  <Button 
                    text="Hapus" 
                    onClick={() => {
                      if (window.confirm(`Yakin ingin menghapus tanaman ${item.nama}?`)) {
                        handleDelete(item.id || item._id);
                      }
                    }} 
                    variant="danger" 
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>Tidak ada data tanaman</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TanamanTable;
