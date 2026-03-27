// ============================================================
// FleetHQ — TypeScript Types
// Mirrors the MySQL schema from Phase 2 EER diagram
// ============================================================

export interface Truck {
  truck_id: number
  name: string
  cuisine_type: string
  license_plate: string
  year: number
  capacity: number
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Retired'
  // joined from EMPLOYEE in list query
  first_name?: string
  last_name?: string
}

export interface Location {
  location_id: number
  address: string
  city: string
  zone_type: 'Commercial' | 'Residential' | 'Park' | 'Event Space' | 'Tourist'
  latitude: number
  longitude: number
  traffic_level: 'Low' | 'Medium' | 'High'
}

export interface Schedule {
  schedule_id: number
  truck_id: number
  location_id: number
  start_datetime: string
  end_datetime: string
  status: 'Active' | 'Pending' | 'Cancelled'
  assigned_by?: string
  // joined fields
  truck_name?: string
  location_address?: string
}

export interface Order {
  order_id: number
  customer_id: number | null
  truck_id: number
  order_date: string
  total_amount: number
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'
  payment_status: 'Pending' | 'Paid' | 'Refunded'
  transaction_id?: string
  // joined fields
  customer_name?: string
  truck_name?: string
  item_count?: number
}

export interface Dish {
  dish_id: number
  menu_id: number
  name: string
  category: 'Main' | 'Side' | 'Drink' | 'Dessert'
  price: number
  ingredient_cost: number
  is_available: boolean
  // joined fields
  truck_name?: string
  truck_id?: number
}

export interface InventoryItem {
  inventory_id: number
  truck_id: number
  ingredient_id: number
  quantity: number
  min_level: number
  last_updated?: string
  status: 'Available' | 'Low'
  // joined fields
  ingredient_name?: string
  unit?: string
  truck_name?: string
}

export interface Customer {
  customer_id: number
  first_name: string
  last_name: string
  name?: string  // computed: first + last
  email: string
  phone?: string
  loyalty_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  loyalty_points: number
  total_orders: number
  joined_date: string
}

export interface Employee {
  employee_id: number
  truck_id?: number
  first_name: string
  last_name: string
  name?: string  // computed
  role: 'Driver' | 'Cook' | 'Manager' | 'Cashier'
  hourly_wage: number
  certification?: string
  cert_expiry?: string
  status: 'Active' | 'Inactive'
  // joined
  truck_name?: string
}

export interface Event {
  event_id: number
  name: string
  event_date: string
  location: string
  organizer?: string
  status: 'Pending' | 'Confirmed' | 'Cancelled'
  // joined
  trucks_booked?: string
  fee_details?: string
}

// Analytics types
export interface DashboardSummary {
  trucks: { total: number; active: number }
  orders: { total: number; pending: number; revenue: number }
  low_stock: number
  customers: number
}

export interface RevenueByTruck {
  truck_name: string
  total_revenue: number
  order_count: number
  avg_order_value: number
}

export interface TopDish {
  dish_name: string
  truck_name: string
  total_qty: number
  total_revenue: number
}

export interface ProfitMargin {
  dish_name: string
  truck_name: string
  price: number
  ingredient_cost: number
  margin_dollars: number
  margin_pct: number
}

export interface DailySales {
  day_name: string
  day_num: number
  avg_order_value: number
  order_count: number
}

export interface ExpiringCert {
  employee_name: string
  role: string
  certification: string
  cert_expiry: string
  truck_name: string
  days_until_expiry: number
}

export interface ScheduleConflict {
  sched_a: number
  sched_b: number
  truck_name: string
  a_start: string
  a_end: string
  b_start: string
  b_end: string
}

// Generic API response
export type ApiResponse<T> = T[]
