// ============================================================
// FleetHQ — Layout (Light Teal Theme)
// ============================================================

import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api';
import { T } from './ui';

// ════════════════════════════════════════════
// NAV CONFIG
// ════════════════════════════════════════════
const NAV_GROUPS = [
  { group: 'Overview', items: [
    { to: '/', icon: '📊', label: 'Dashboard' },
  ]},
  { group: 'Fleet', items: [
    { to: '/trucks',    icon: '🚚', label: 'Trucks' },
    { to: '/schedules', icon: '📅', label: 'Schedules' },
    { to: '/locations', icon: '📍', label: 'Locations' },
  ]},
  { group: 'Operations', items: [
    { to: '/orders',    icon: '🧾', label: 'Orders', badge: true },
    { to: '/menu',      icon: '🍽️', label: 'Menu & Dishes' },
    { to: '/inventory', icon: '📦', label: 'Inventory' },
  ]},
  { group: 'People', items: [
    { to: '/customers', icon: '👥', label: 'Customers' },
    { to: '/staff',     icon: '👷', label: 'Staff' },
  ]},
  { group: 'More', items: [
    { to: '/events',    icon: '🎪', label: 'Events' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
  ]},
]

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/':          { title: 'Today',     sub: 'Dashboard' },
  '/trucks':    { title: 'Trucks',    sub: 'Fleet Vehicles' },
  '/schedules': { title: 'Schedules', sub: 'Location Assignments' },
  '/locations': { title: 'Locations', sub: 'Operating Spots' },
  '/orders':    { title: 'Orders',    sub: 'Order Management' },
  '/menu':      { title: 'Menu',      sub: 'Dishes & Pricing' },
  '/inventory': { title: 'Inventory', sub: 'Stock Levels' },
  '/customers': { title: 'Customers', sub: 'Loyalty Program' },
  '/staff':     { title: 'Staff',     sub: 'Employee Roster' },
  '/events':    { title: 'Events',    sub: 'Event Bookings' },
  '/analytics': { title: 'Analytics', sub: 'Business Intelligence' },
}

// ════════════════════════════════════════════
// ICON SIDEBAR  (slim, navy, icon-only)
// ════════════════════════════════════════════
export function IconSidebar() {
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsApi.summary,
    refetchInterval: 30_000,
  })
  const pending = summary?.orders?.pending ?? 0

  return (
    <aside style={{
      width: 58, background: T.navy,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      flexShrink: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        width: '100%', height: 62,
        background: T.teal,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,181,164,.3)',
      }}>🚚</div>

      {/* Nav icons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '10px 0', gap: 3 }}>
        {NAV_GROUPS.flatMap(g => g.items).map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {({ isActive }) => (
              <div title={item.label} style={{
                width: 40, height: 40, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 17, position: 'relative',
                background: isActive ? T.teal : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,.4)',
                boxShadow: isActive ? '0 4px 12px rgba(0,181,164,.4)' : 'none',
                transition: 'all .15s',
              }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.1)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.9)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.4)'
                  }
                }}
              >
                {item.icon}
                {(item as any).badge && pending > 0 && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#fc8181', color: '#fff',
                    fontSize: 8, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {pending > 9 ? '9+' : pending}
                  </div>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Settings + avatar */}
      <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'rgba(255,255,255,.3)', cursor: 'pointer' }}>
          ⚙️
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#fff', cursor: 'pointer',
        }}>
          JN
        </div>
      </div>
    </aside>
  )
}

// ════════════════════════════════════════════
// LEFT PANEL  (dark gradient, calendar + widgets)
// ════════════════════════════════════════════
function CalendarWidget() {
  const [calYear, setCalYear] = React.useState(2026)
  const [calMonth, setCalMonth] = React.useState(2) // March

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const today = new Date()
  const isThisMonth = today.getMonth() === calMonth && today.getFullYear() === calYear
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const prev = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }
  const next = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }

  const eventDays = [5, 10, 14, 20, 26]

  return (
    <div>
      {/* Calendar header */}
      <div style={{ padding: '18px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <button onClick={prev} style={{ background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{MONTHS[calMonth]} {calYear}</span>
        <button onClick={next} style={{ background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>

      {/* Day names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 14px', gap: 2 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', padding: '3px 0' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 14px 12px', gap: 2 }}>
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = isThisMonth && day === today.getDate()
          const hasEvent = eventDays.includes(day) && !isToday
          return (
            <div key={day} style={{
              textAlign: 'center', fontSize: 11, fontWeight: isToday ? 800 : 500,
              color: isToday ? '#fff' : 'rgba(255,255,255,.65)',
              padding: '5px 2px', borderRadius: 7, cursor: 'pointer',
              background: isToday ? T.teal : 'transparent',
              position: 'relative',
            }}>
              {day}
              {hasEvent && <div style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: T.teal2 }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// We need React imported for CalendarWidget
import React from 'react'

export function LeftPanel() {
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsApi.summary,
  })

  const QUICK = [
    { label: 'Active Trucks',   sub: `${summary?.trucks?.active ?? '…'}/${summary?.trucks?.total ?? '…'} vehicles`, color: T.teal2,   path: '/trucks' },
    { label: 'Pending Orders',  sub: `${summary?.orders?.pending ?? '…'} awaiting`,                                  color: T.amber,   path: '/orders' },
    { label: 'Low Stock Items', sub: `${summary?.low_stock ?? '…'} to reorder`,                                      color: T.red,     path: '/inventory' },
    { label: 'Total Revenue',   sub: `$${Number(summary?.orders?.revenue ?? 0).toFixed(0)} all time`,                color: T.purple,  path: '/analytics' },
  ]

  return (
    <aside style={{
      width: 224, flexShrink: 0, overflowY: 'auto',
      background: 'linear-gradient(160deg, #1a2340 0%, #0d4a44 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <CalendarWidget />

      {/* Quick access */}
      <div style={{ padding: '8px 12px 4px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
          Quick Access
        </div>
        {QUICK.map(q => (
          <NavLink key={q.label} to={q.path}>
            <div style={{
              background: 'rgba(255,255,255,.09)', borderRadius: 10, padding: '10px 12px',
              marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', border: '1px solid rgba(255,255,255,.07)',
              transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.16)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.09)'}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: q.color, marginRight: 10, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{q.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>{q.sub}</div>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,.25)', fontSize: 14 }}>···</span>
            </div>
          </NavLink>
        ))}
      </div>

  
    </aside>
  )
}

// ════════════════════════════════════════════
// TOP BAR
// ════════════════════════════════════════════
interface TopBarProps {
  search: string
  onSearch: (q: string) => void
  onAdd?: () => void
  showAdd?: boolean
}

export function TopBar({ search, onSearch, onAdd, showAdd }: TopBarProps) {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? { title: 'FleetHQ', sub: '' }

  return (
    <header style={{
      height: 62, background: T.white,
      borderBottom: `1px solid ${T.bdr}`,
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14,
      flexShrink: 0,
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.txt, letterSpacing: -0.5 }}>
          {meta.title}{' '}
          <span style={{ color: T.txt3, fontWeight: 400, fontSize: 16 }}>{meta.sub}</span>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: T.bg, border: `1.5px solid ${T.bdr}`, borderRadius: 24,
        padding: '0 14px', height: 38, minWidth: 200,
        transition: 'border .15s',
      }}
        onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = T.teal}
        onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = T.bdr}
      >
        <span style={{ color: T.txt3, fontSize: 14 }}>🔍</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search records…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: T.txt, fontSize: 13, fontFamily: 'var(--font)',
            fontWeight: 600, width: '100%',
          }}
        />
      </div>

      {/* Add button */}
      {showAdd && (
        <button onClick={onAdd} style={{
          background: T.teal, color: '#fff', border: 'none', borderRadius: 24,
          padding: '0 20px', height: 38, fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'var(--font)', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,181,164,.3)', transition: 'all .15s',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.teal2; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.teal; (e.currentTarget as HTMLElement).style.transform = '' }}
        >
          ＋ Add New
        </button>
      )}

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.txt }}>Jenny Nguyen</div>
          <div style={{ fontSize: 10, color: T.txt3 }}>Fleet Manager</div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
        }}>JN</div>
      </div>
    </header>
  )
}

// ════════════════════════════════════════════
// PAGE CONTENT WRAPPER
// ════════════════════════════════════════════
export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: T.bg }}>
      <div className="slide-up">{children}</div>
    </main>
  )
}
