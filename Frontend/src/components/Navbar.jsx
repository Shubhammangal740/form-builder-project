import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="navbar-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
          }}>F</div>
          <h1 className="navbar-logo" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Form<span style={{ color: 'var(--primary)' }}>Builder</span>
          </h1>
        </div>
        
        <div className="navbar-links" style={{ display: 'flex', gap: '0.5rem' }}>
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            style={({ isActive }) => ({
              padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '500', fontSize: '0.875rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
            })}
          >
            <span style={{ fontSize: '1.2em' }}>&#127968;</span> Dashboard
          </NavLink>
          <NavLink 
            to="/admin/create-form" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            style={({ isActive }) => ({
              padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '500', fontSize: '0.875rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
            })}
          >
            <span style={{ fontSize: '1.2em' }}>&#10133;</span> Create Form
          </NavLink>
          <NavLink 
            to="/admin/forms" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            style={({ isActive }) => ({
              padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '500', fontSize: '0.875rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
            })}
          >
            <span style={{ fontSize: '1.2em' }}>&#128193;</span> Forms List
          </NavLink>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .navbar-container { flex-direction: column; gap: 1rem; padding: 1rem; }
          .navbar-links { width: 100%; justify-content: center; flex-wrap: wrap; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
