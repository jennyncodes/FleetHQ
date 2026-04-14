// pages/TruckList.tsx
// Food Truck Management with beautiful animations

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/main.css';

interface Truck {
  truck_id: number;
  truck_name: string;
  cuisine_type: string;
  status: 'Active' | 'Inactive';
  license_plate: string;
}

export default function TruckList() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await axios.get('https://db-group4-492222.wl.r.appspot.com/api/trucks');
      setTrucks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (truckId: number, truckName: string) => {
    if (window.confirm(`Are you sure you want to delete ${truckName}?`)) {
      try {
        await axios.delete(`https://db-group4-492222.wl.r.appspot.com/api/trucks/${truckId}`);
        showToast('success', 'Truck deleted successfully!');
        fetchTrucks();
      } catch (error) {
        console.error('Error deleting truck:', error);
        showToast('error', 'Failed to delete truck');
      }
    }
  };

  const showToast = (type: string, message: string) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '✗'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.truck_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || truck.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="loader"></div>
        <p>Loading trucks...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      {/* Background Blobs */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Header */}
      <div className="fade-in-up" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>🚚 Food Truck Fleet</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-medium)' }}>
          Manage your mobile food empire
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="stat-card stagger-item">
          <div className="stat-label">Total Trucks</div>
          <div className="stat-value">{trucks.length}</div>
        </div>
        <div className="stat-card stagger-item">
          <div className="stat-label">Active Trucks</div>
          <div className="stat-value" style={{ color: '#4CAF50' }}>
            {trucks.filter(t => t.status === 'Active').length}
          </div>
        </div>
        <div className="stat-card stagger-item">
          <div className="stat-label">Inactive Trucks</div>
          <div className="stat-value" style={{ color: '#F44336' }}>
            {trucks.filter(t => t.status === 'Inactive').length}
          </div>
        </div>
        <div className="stat-card stagger-item">
          <div className="stat-label">Cuisine Types</div>
          <div className="stat-value">
            {new Set(trucks.map(t => t.cuisine_type)).size}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search trucks by name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              className={`btn ${filterStatus === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('All')}
              style={{ padding: '0.5rem 1rem' }}
            >
              All
            </button>
            <button
              className={`btn ${filterStatus === 'Active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('Active')}
              style={{ padding: '0.5rem 1rem' }}
            >
              Active
            </button>
            <button
              className={`btn ${filterStatus === 'Inactive' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('Inactive')}
              style={{ padding: '0.5rem 1rem' }}
            >
              Inactive
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/trucks/new'}
          >
            + Add New Truck
          </button>
        </div>
      </div>

      {/* Trucks Table */}
      <div className="table-container fade-in-up">
        {filteredTrucks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
            <h3>No trucks found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>Truck Name</th>
                <th>Cuisine Type</th>
                <th>Status</th>
                <th>License Plate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrucks.map((truck, index) => (
                <tr key={truck.truck_id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td>
                    <strong>#{truck.truck_id}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span style={{ fontSize: '1.5rem' }}>🚚</span>
                      <strong>{truck.truck_name}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      background: 'var(--peach-light)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem'
                    }}>
                      {truck.cuisine_type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${truck.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {truck.status}
                    </span>
                  </td>
                  <td>
                    <code style={{ 
                      background: 'var(--gray-light)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>
                      {truck.license_plate}
                    </code>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => window.location.href = `/trucks/edit/${truck.truck_id}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(truck.truck_id, truck.truck_name)}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.9rem',
                          background: '#FFEBEE',
                          color: '#C62828'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fun Stats Footer */}
      <div className="card" style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', margin: 0 }}>
          🎉 Managing <strong>{trucks.length}</strong> trucks serving delicious{' '}
          <strong>{new Set(trucks.map(t => t.cuisine_type)).size}</strong> cuisine types!
        </p>
      </div>
    </div>
  );
}