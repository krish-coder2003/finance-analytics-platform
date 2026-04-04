import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      fetchUsers(); // Refresh
    } catch (error) {
      alert(error.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (userId === user._id) {
      return alert("You cannot delete your own account.");
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Refresh
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
      </div>

      <div className="users-grid">
        {users.map(u => (
          <div className="card user-card" key={u._id}>
            <div className="user-header">
              <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <div className="user-name">{u.name}</div>
                <div className="user-email">{u.email}</div>
                <div className={`user-role-badge role-${u.role.toLowerCase()}`}>{u.role}</div>
              </div>
            </div>

            <div className="user-actions">
              <select 
                className="role-select" 
                value={u.role}
                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                disabled={u._id === user._id}
              >
                <option value="Viewer">Viewer</option>
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
              </select>

              <select 
                className="role-select" 
                value={u.isActive ? 'true' : 'false'}
                onChange={(e) => async function(){ 
                  try {
                    await api.patch(`/users/${u._id}`, { isActive: e.target.value === 'true' });
                    fetchUsers();
                  } catch (err) { alert('Failed updating status'); }
                }()}
                disabled={u._id === user._id}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <button 
                className="btn-icon delete" 
                onClick={() => handleDelete(u._id)}
                disabled={u._id === user._id}
                title="Delete User"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
