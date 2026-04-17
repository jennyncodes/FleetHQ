 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://db-group4-492222.wl.r.appspot.com';

interface DashboardStats {
  total_trucks: number;
  active_trucks: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  total_customers: number;
  todays_orders: number;
  completed_orders: number;
  recent_activity: RecentOrder[];
}

interface RecentOrder {
  order_id: number;
  order_date: string;
  order_status: string;
  total_amount: number;
  customer_name: string;
  truck_name: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#D87B2A' }}>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#F44336' }}>Error</h2>
        <p>{error}</p>
        <button
          onClick={fetchDashboardStats}
          style={{
            padding: '10px 20px',
            backgroundColor: '#D87B2A',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#D87B2A', marginBottom: '10px' }}>
        Dashboard
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Welcome to FleetHQ! Here's your fleet overview.
      </p>

      {/* Quick Actions */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', color: '#D87B2A', marginBottom: '20px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            className="action-btn-filled"
            onClick={() => navigate('/trucks')}
          >
            + Add New Truck
          </button>
          <button 
            className="action-btn-filled"
            onClick={() => navigate('/orders')}
          >
            + New Order
          </button>
          <button 
            className="action-btn-filled"
            onClick={() => navigate('/menu')}
          >
            + Add Menu Item
          </button>
          <button 
            className="action-btn-outline"
            onClick={() => navigate('/schedule')}
          >
            📅 View Schedule
          </button>
          <button 
            className="action-btn-outline"
            onClick={() => navigate('/inventory')}
          >
            📦 Check Inventory
          </button>
          <button 
            className="action-btn-outline"
            onClick={() => navigate('/analytics')}
          >
            📊 View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <StatCard
          title="TOTAL TRUCKS"
          value={stats.total_trucks}
          icon="🚚"
          color="#D87B2A"
        />
        <StatCard
          title="ACTIVE TRUCKS"
          value={stats.active_trucks}
          icon="✅"
          color="#4CAF50"
        />
        <StatCard
          title="TOTAL ORDERS"
          value={stats.total_orders}
          icon="🍔"
          color="#D87B2A"
        />
        <StatCard
          title="TOTAL REVENUE"
          value={formatCurrency(stats.total_revenue)}
          icon="💰"
          color="#FFB300"
        />
        <StatCard
          title="PENDING ORDERS"
          value={stats.pending_orders}
          icon="⏳"
          color="#FF9800"
        />
        <StatCard
          title="CUSTOMERS"
          value={stats.total_customers}
          icon="👥"
          color="#2196F3"
        />
        <StatCard
          title="TODAY'S ORDERS"
          value={stats.todays_orders}
          icon="📝"
          color="#03A9F4"
        />
        <StatCard
          title="COMPLETED ORDERS"
          value={stats.completed_orders}
          icon="✓"
          color="#66BB6A"
        />
      </div>

      {/* Recent Activity */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #D87B2A',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', color: '#D87B2A', marginBottom: '20px' }}>
          Recent Activity
        </h2>

        {stats.recent_activity.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            Recent orders, truck updates, and system events will appear here.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stats.recent_activity.map((order) => (
              <div
                key={order.order_id}
                style={{
                  padding: '15px',
                  backgroundColor: '#F8F5F0',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getStatusColor(order.order_status)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Order #{order.order_id} - {order.customer_name}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {order.truck_name} • {formatDate(order.order_date)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontWeight: 'bold',
                      color: getStatusColor(order.order_status),
                      marginBottom: '5px',
                    }}
                  >
                    {order.order_status}
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .action-btn-filled {
          padding: 12px 24px;
          background-color: #D87B2A;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn-filled:hover {
          background-color: #C06A1F;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(216, 123, 42, 0.3);
        }

        .action-btn-outline {
          padding: 12px 24px;
          background-color: white;
          color: #D87B2A;
          border: 2px solid #D87B2A;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn-outline:hover {
          background-color: #FFF5EE;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#FFF9F0',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #F0E6D2',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#666',
              fontWeight: 'bold',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color }}>
            {value}
          </p>
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </div>
    </div>
  );
}