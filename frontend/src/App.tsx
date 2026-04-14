// App.tsx
// Main application with routing

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TruckList from './pages/TruckList';
import TruckForm from './pages/TruckForm';
import MenuList from './pages/MenuList';
import {
  MenuForm,
  OrderList,
  OrderForm,
  CustomerList,
  CustomerForm,
  ScheduleList,
  InventoryList,
  Analytics
} from './pages/OtherPages';
import './styles/main.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Landing page without header */}
          <Route path="/" element={<LandingPage />} />
          
          {/* All other routes with header */}
          <Route path="/*" element={<AppWithHeader />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper component for routes that need header
function AppWithHeader() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Trucks */}
          <Route path="/trucks" element={<TruckList />} />
          <Route path="/trucks/new" element={<TruckForm />} />
          <Route path="/trucks/edit/:id" element={<TruckForm />} />
          
          {/* Menu */}
          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/new" element={<MenuForm />} />
          <Route path="/menu/edit/:id" element={<MenuForm />} />
          
          {/* Orders */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/edit/:id" element={<OrderForm />} />
          
          {/* Customers */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          
          {/* Schedule */}
          <Route path="/schedule" element={<ScheduleList />} />
          
          {/* Inventory */}
          <Route path="/inventory" element={<InventoryList />} />
          
          {/* Analytics */}
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </>
  );
}