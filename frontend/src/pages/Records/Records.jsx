import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X, Search } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Records.css';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (filterType) query += `&type=${filterType}`;
      if (filterCategory) query += `&category=${filterCategory}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;

      const res = await api.get(`/records${query}`);
      setRecords(res.data.records);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, filterType, filterCategory, startDate, endDate]);

  const handleOpenModal = (record = null) => {
    if (record) {
      setCurrentRecord(record);
      setFormData({
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: new Date(record.date).toISOString().split('T')[0],
        notes: record.notes || ''
      });
    } else {
      setCurrentRecord(null);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await api.patch(`/records/${currentRecord._id}`, formData);
      } else {
        await api.post('/records', formData);
      }
      handleCloseModal();
      fetchRecords();
    } catch (error) {
      console.error('Failed to save record', error);
      alert(error.message || 'Failed to save record');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/records/${id}`);
        fetchRecords();
      } catch (error) {
        console.error('Failed to delete', error);
        alert(error.message || 'Failed to delete record');
      }
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Analyst';

  return (
    <div>
      <div className="records-header">
        <h1 className="page-title">Transactions</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Record
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type Filter:</label>
          <select className="filter-select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Category:</label>
          <input className="filter-select" type="text" placeholder="Search category" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} onBlur={() => setPage(1)} />
        </div>
        <div className="filter-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dates:</label>
          <input className="filter-select" type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
          <span style={{color: 'white'}}>-</span>
          <input className="filter-select" type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No records found.</td></tr>
            ) : (
              records.map(record => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`type-badge ${record.type}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>{record.category}</td>
                  <td className={record.type === 'income' ? 'text-success' : ''}>
                    ${record.amount.toFixed(2)}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {record.notes || '-'}
                  </td>
                  {canEdit && (
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => handleOpenModal(record)}>
                          <Edit2 size={16} />
                        </button>
                        {(user?.role === 'Admin' || record.user?._id === user?._id) && (
                           <button className="btn-icon delete" onClick={() => handleDeleteRecord(record._id)}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="btn btn-outline" 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span className="page-info">Page {page} of {totalPages || 1}</span>
        <button 
          className="btn btn-outline" 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{currentRecord ? 'Edit Record' : 'Add Record'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveRecord}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select 
                  className="form-input" 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input" 
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                  placeholder="e.g. Salary, Groceries, Rent"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
