// pages/TruckForm.tsx
// Form for creating and editing trucks

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface TruckFormData {
  truck_name: string;
  cuisine_type: string;
  status: 'Active' | 'Inactive';
  license_plate: string;
}

export default function TruckForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TruckFormData>({
    truck_name: '',
    cuisine_type: '',
    status: 'Active',
    license_plate: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchTruck();
    }
  }, [id, isEdit]);

  const fetchTruck = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://db-group4-492222.wl.r.appspot.com/api/trucks/${id}`);
      const data = await response.json();
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching truck:', error);
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit 
        ? `https://db-group4-492222.wl.r.appspot.com/api/trucks/${id}`
        : 'https://db-group4-492222.wl.r.appspot.com/api/trucks';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('success', `Truck ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/trucks');
      } else {
        throw new Error('Failed to save truck');
      }
    } catch (error) {
      console.error('Error saving truck:', error);
      showToast('error', 'Failed to save truck');
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div className="loader"></div>
        <p>Loading truck...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '700px', margin: '0 auto' }}>
      {/* Background */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
      </div>

      <h1 className="fade-in-up">
        {isEdit ? '✏️ Edit Truck' : '➕ Add New Truck'}
      </h1>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div className="form-group">
          <label>Truck Name *</label>
          <input
            type="text"
            value={formData.truck_name}
            onChange={(e) => setFormData({ ...formData, truck_name: e.target.value })}
            placeholder="e.g., Taco Thunder"
            required
          />
        </div>

        <div className="form-group">
          <label>Cuisine Type *</label>
          <input
            type="text"
            value={formData.cuisine_type}
            onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
            placeholder="e.g., Mexican, American, Thai"
            required
          />
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>License Plate *</label>
          <input
            type="text"
            value={formData.license_plate}
            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
            placeholder="e.g., ABC1234"
            maxLength={7}
            required
          />
          <small style={{ color: 'var(--gray-medium)' }}>7 characters maximum</small>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-sm)', 
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--gray-light)'
        }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Truck' : 'Create Truck'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
            onClick={() => navigate('/trucks')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}