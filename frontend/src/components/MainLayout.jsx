import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, LogOut, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Activity className="sidebar-logo-icon" size={28} />
          <span className="sidebar-title">FinRecord</span>
        </div>
        
        <nav className="nav-menu">
          <NavLink 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {user?.role !== 'Viewer' && (
            <NavLink 
              to="/records" 
              className={`nav-item ${location.pathname === '/records' ? 'active' : ''}`}
            >
              <Wallet size={20} />
              <span>Records</span>
            </NavLink>
          )}
          
          {user?.role === 'Admin' && (
            <NavLink 
              to="/users" 
              className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="btn btn-outline logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content header-padding">
        <div className="page-container animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
