// pages/OtherPages.tsx
// Placeholder pages - implement these following the TruckList/TruckForm pattern

import { useNavigate } from 'react-router-dom';

// MenuForm
export function MenuForm() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Add Menu Item</h1>
      <div className="card">
        <p>Menu form coming soon. Follow TruckForm.tsx pattern.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/menu')}>Back</button>
      </div>
    </div>
  );
}

// OrderList
export function OrderList() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs"><div className="blob blob-1"></div></div>
      <h1 className="fade-in-up">💰 Orders</h1>
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>💰</div>
          <h3>Order Management</h3>
          <p style={{ color: 'var(--gray-medium)', marginBottom: 'var(--spacing-lg)' }}>
            View and manage all orders here. Track pending, completed, and cancelled orders.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
            New Order
          </button>
        </div>
      </div>
    </div>
  );
}

// OrderForm
export function OrderForm() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Create Order</h1>
      <div className="card">
        <p>Order form coming soon.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>Back</button>
      </div>
    </div>
  );
}

// CustomerList
export function CustomerList() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs"><div className="blob blob-1"></div></div>
      <h1 className="fade-in-up">👥 Customers</h1>
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>👥</div>
          <h3>Customer Management</h3>
          <p style={{ color: 'var(--gray-medium)', marginBottom: 'var(--spacing-lg)' }}>
            Manage customer information, view order history, and track loyalty points.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}

// CustomerForm
export function CustomerForm() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Add Customer</h1>
      <div className="card">
        <p>Customer form coming soon.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/customers')}>Back</button>
      </div>
    </div>
  );
}

// ScheduleList
export function ScheduleList() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs"><div className="blob blob-1"></div></div>
      <h1 className="fade-in-up">📅 Schedule</h1>
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
          <h3>Schedule Management</h3>
          <p style={{ color: 'var(--gray-medium)' }}>
            View and manage truck schedules. Assign trucks to locations and prevent conflicts.
          </p>
        </div>
      </div>
    </div>
  );
}

// InventoryList
export function InventoryList() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs"><div className="blob blob-1"></div></div>
      <h1 className="fade-in-up">📦 Inventory</h1>
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
          <h3>Inventory Management</h3>
          <p style={{ color: 'var(--gray-medium)' }}>
            Track ingredient levels across all trucks. Get alerts when stock runs low.
          </p>
        </div>
      </div>
    </div>
  );
}

// Analytics
export function Analytics() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div className="background-blobs"><div className="blob blob-1"></div></div>
      <h1 className="fade-in-up">📈 Analytics</h1>
      <div className="card">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>📈</div>
          <h3>Analytics Dashboard</h3>
          <p style={{ color: 'var(--gray-medium)' }}>
            View sales trends, popular items, revenue by location, and other business insights.
          </p>
        </div>
      </div>
    </div>
  );
}