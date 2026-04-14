// pages/Dashboard.tsx
// Main dashboard with statistics and overview

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Loading } from '../components/Utility';

interface DashboardStats {
  totalTrucks: number;
  activeTrucks: number;
  inactiveTrucks: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  todayOrders: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrucks: 0,
    activeTrucks: 0,
    inactiveTrucks: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    // In a real app, you'd have a /api/dashboard/stats endpoint
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulate API call - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalTrucks: 8,
          activeTrucks: 6,
          inactiveTrucks: 2,
          totalOrders: 147,
          pendingOrders: 12,
          completedOrders: 132,
          totalCustomers: 456,
          totalRevenue: 15847.50,
          todayOrders: 23
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      {/* Background */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Header */}
      <div className="fade-in-up" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>Dashboard</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-medium)' }}>
          Welcome to FleetHQ! Here's your fleet overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="card fade-in-up" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-sm)'
        }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/trucks/new')}
          >
            + Add New Truck
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/orders/new')}
          >
            + New Order
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/menu/new')}
          >
            + Add Menu Item
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/schedule')}
          >
            📅 View Schedule
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/inventory')}
          >
            📦 Check Inventory
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/analytics')}
          >
            📈 View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <StatCard
          label="Total Trucks"
          value={stats.totalTrucks}
          icon="🚚"
          index={0}
        />
        <StatCard
          label="Active Trucks"
          value={stats.activeTrucks}
          icon="✅"
          color="#4CAF50"
          index={1}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          index={2}
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          index={3}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon="⏳"
          color="#FF9800"
          index={4}
        />
        <StatCard
          label="Customers"
          value={stats.totalCustomers}
          icon="👥"
          index={5}
        />
        <StatCard
          label="Today's Orders"
          value={stats.todayOrders}
          icon="📈"
          color="#2196F3"
          index={6}
        />
        <StatCard
          label="Completed Orders"
          value={stats.completedOrders}
          icon="✓"
          color="#4CAF50"
          index={7}
        />
      </div>

      

      {/* Recent Activity (Placeholder) */}
      <div className="card fade-in-up">
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Activity</h3>
        <p style={{ color: 'var(--gray-medium)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
          Recent orders, truck updates, and system events will appear here.
        </p>
      </div>
    </div>
  );
}