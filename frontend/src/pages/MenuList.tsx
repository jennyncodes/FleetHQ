// pages/MenuList.tsx
import { useNavigate } from 'react-router-dom';

export default function MenuList() {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
      </div>
      
      <h1 className="fade-in-up">📋 Menu Management</h1>
      
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
          <h3>Menu Management Coming Soon</h3>
          <p style={{ color: 'var(--gray-medium)', marginBottom: 'var(--spacing-lg)' }}>
            Manage your truck menus and dishes here. Add new items, update prices, and control availability.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/menu/new')}>
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
}