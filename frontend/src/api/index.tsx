// ============================================================
// FleetHQ — API Client
// ============================================================

const BASE = '/api'

async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? 'Request failed')
  }
  return res.json()
}

// ── Trucks ────────────────────────────────────────────────
export const trucksApi = {
  list:   (q = '') => request<import('../types').Truck[]>(`/trucks?q=${q}`),
  get:    (id: number) => request<import('../types').Truck>(`/trucks/${id}`),
  create: (data: Partial<import('../types').Truck>) => request(`/trucks`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Truck>) => request(`/trucks/${id}`, 'PUT', data),
  delete: (id: number) => request(`/trucks/${id}`, 'DELETE'),
}

// ── Locations ─────────────────────────────────────────────
export const locationsApi = {
  list:   (q = '') => request<import('../types').Location[]>(`/locations?q=${q}`),
  get:    (id: number) => request<import('../types').Location>(`/locations/${id}`),
  create: (data: Partial<import('../types').Location>) => request(`/locations`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Location>) => request(`/locations/${id}`, 'PUT', data),
  delete: (id: number) => request(`/locations/${id}`, 'DELETE'),
}

// ── Schedules ─────────────────────────────────────────────
export const schedulesApi = {
  list:   (q = '') => request<import('../types').Schedule[]>(`/schedules?q=${q}`),
  get:    (id: number) => request<import('../types').Schedule>(`/schedules/${id}`),
  create: (data: Partial<import('../types').Schedule>) => request(`/schedules`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Schedule>) => request(`/schedules/${id}`, 'PUT', data),
  delete: (id: number) => request(`/schedules/${id}`, 'DELETE'),
}

// ── Orders ────────────────────────────────────────────────
export const ordersApi = {
  list:   (q = '') => request<import('../types').Order[]>(`/orders?q=${q}`),
  get:    (id: number) => request<import('../types').Order>(`/orders/${id}`),
  create: (data: Partial<import('../types').Order>) => request(`/orders`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Order>) => request(`/orders/${id}`, 'PUT', data),
  delete: (id: number) => request(`/orders/${id}`, 'DELETE'),
}

// ── Menu / Dishes ─────────────────────────────────────────
export const menuApi = {
  list:   (q = '') => request<import('../types').Dish[]>(`/menu?q=${q}`),
  get:    (id: number) => request<import('../types').Dish>(`/menu/${id}`),
  create: (data: Partial<import('../types').Dish> & { truck_id: number }) => request(`/menu`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Dish>) => request(`/menu/${id}`, 'PUT', data),
  delete: (id: number) => request(`/menu/${id}`, 'DELETE'),
}

// ── Inventory ─────────────────────────────────────────────
export const inventoryApi = {
  list:   (q = '') => request<import('../types').InventoryItem[]>(`/inventory?q=${q}`),
  get:    (id: number) => request<import('../types').InventoryItem>(`/inventory/${id}`),
  create: (data: Partial<import('../types').InventoryItem> & { ingredient_name: string }) => request(`/inventory`, 'POST', data),
  update: (id: number, data: Partial<import('../types').InventoryItem>) => request(`/inventory/${id}`, 'PUT', data),
  delete: (id: number) => request(`/inventory/${id}`, 'DELETE'),
}

// ── Customers ─────────────────────────────────────────────
export const customersApi = {
  list:   (q = '') => request<import('../types').Customer[]>(`/customers?q=${q}`),
  get:    (id: number) => request<import('../types').Customer>(`/customers/${id}`),
  create: (data: Partial<import('../types').Customer>) => request(`/customers`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Customer>) => request(`/customers/${id}`, 'PUT', data),
  delete: (id: number) => request(`/customers/${id}`, 'DELETE'),
}

// ── Staff / Employees ─────────────────────────────────────
export const staffApi = {
  list:   (q = '') => request<import('../types').Employee[]>(`/staff?q=${q}`),
  get:    (id: number) => request<import('../types').Employee>(`/staff/${id}`),
  create: (data: Partial<import('../types').Employee>) => request(`/staff`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Employee>) => request(`/staff/${id}`, 'PUT', data),
  delete: (id: number) => request(`/staff/${id}`, 'DELETE'),
}

// ── Events ────────────────────────────────────────────────
export const eventsApi = {
  list:   (q = '') => request<import('../types').Event[]>(`/events?q=${q}`),
  get:    (id: number) => request<import('../types').Event>(`/events/${id}`),
  create: (data: Partial<import('../types').Event>) => request(`/events`, 'POST', data),
  update: (id: number, data: Partial<import('../types').Event>) => request(`/events/${id}`, 'PUT', data),
  delete: (id: number) => request(`/events/${id}`, 'DELETE'),
}

// ── Analytics ─────────────────────────────────────────────
export const analyticsApi = {
  summary:           () => request<import('../types').DashboardSummary>(`/analytics/summary`),
  revenueByTruck:    () => request<import('../types').RevenueByTruck[]>(`/analytics/revenue-by-truck`),
  topDishes:         () => request<import('../types').TopDish[]>(`/analytics/top-dishes`),
  profitMargins:     () => request<import('../types').ProfitMargin[]>(`/analytics/profit-margins`),
  dailySales:        () => request<import('../types').DailySales[]>(`/analytics/daily-avg-sales`),
  expiringCerts:     () => request<import('../types').ExpiringCert[]>(`/analytics/expiring-certs`),
  scheduleConflicts: () => request<import('../types').ScheduleConflict[]>(`/analytics/schedule-conflicts`),
  retention:         () => request<{ retained_customers: number; prev_month_customers: number }>(`/analytics/customer-retention`),
}
