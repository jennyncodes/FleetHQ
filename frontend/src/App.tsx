import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui';
import { IconSidebar, LeftPanel } from './components/Layout';
import Dashboard     from './pages/Dashboard';
// import TrucksPage    from './pages/Trucks';
// import OrdersPage    from './pages/Orders';
// import CustomersPage from './pages/Customers';
// import InventoryPage from './pages/Inventory';
// import MenuPage      from './pages/Menu';
// import StaffPage     from './pages/Staff';
// import AnalyticsPage from './pages/Analytics';
// import { LocationsPage, SchedulesPage, EventsPage } from './pages/FleetPages';

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <IconSidebar />
            <LeftPanel />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
              <Routes>
                <Route path="/"          element={<Dashboard />} />
                {/* <Route path="/trucks"    element={<TrucksPage />} />
                <Route path="/schedules" element={<SchedulesPage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/orders"    element={<OrdersPage />} />
                <Route path="/menu"      element={<MenuPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/staff"     element={<StaffPage />} />
                <Route path="/events"    element={<EventsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} /> */}
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}
