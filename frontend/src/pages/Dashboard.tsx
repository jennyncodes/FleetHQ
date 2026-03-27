import { useQuery } from '@tanstack/react-query';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import { analyticsApi } from '../api';
import { StatCard, Card, CardTitle, LoadingState, Money, Pill, Mono, T } from '../components/ui';
import { TopBar, PageContent } from '../components/Layout';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const COLORS = ['#00b5a4', '#4299e1', '#f6ad55', '#9f7aea', '#48bb78']
const GRID   = '#f1f5f9'
const TICK   = '#a0aec0'

export default function Dashboard() {
  const summary   = useQuery({ queryKey: ['analytics-summary'],    queryFn: analyticsApi.summary })
  const revenue   = useQuery({ queryKey: ['analytics-revenue'],    queryFn: analyticsApi.revenueByTruck })
  const topDishes = useQuery({ queryKey: ['analytics-top-dishes'], queryFn: analyticsApi.topDishes })
  const daily     = useQuery({ queryKey: ['analytics-daily'],      queryFn: analyticsApi.dailySales })

  const s = summary.data

  return (
    <>
      <TopBar search="" onSearch={() => {}} showAdd={false} />
      <PageContent>
        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
          {summary.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: T.white, border: `1px solid ${T.bdr}`, borderRadius: T.r2, height: 124, boxShadow: T.shadow, animation: 'pulse 1.5s ease infinite' }} />
              ))
            : <>
                <StatCard icon="🚚" value={`${s?.trucks?.active ?? 0}/${s?.trucks?.total ?? 0}`}
                  label="Active Trucks" delta={`▲ ${s?.trucks?.active ?? 0} on road today`} deltaUp
                  accentColor={T.teal} />
                <StatCard icon="⏳" value={s?.orders?.pending ?? 0}
                  label="Pending Orders" delta={`⚠ ${s?.orders?.pending ?? 0} need attention`} deltaUp={false}
                  accentColor={T.red} />
                <StatCard icon="💰" value={`$${Number(s?.orders?.revenue ?? 0).toFixed(0)}`}
                  label="Total Revenue" delta="▲ All time" deltaUp
                  accentColor={T.amber} />
                <StatCard icon="📦" value={s?.low_stock ?? 0}
                  label="Low Stock Alerts"
                  delta={(s?.low_stock ?? 0) > 0 ? `▼ ${s?.low_stock} to reorder` : '✓ All stocked'}
                  deltaUp={(s?.low_stock ?? 0) === 0}
                  accentColor={T.blue} />
              </>
          }
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, marginBottom: 14 }}>
          {/* Weekly bar chart */}
          <Card>
            <CardTitle>
              Weekly Orders
              <span style={{ fontSize: 11, color: T.txt3, fontWeight: 500 }}>This week</span>
            </CardTitle>
            {daily.isLoading ? <LoadingState /> : (
              <div style={{ height: 155 }}>
                <Bar
                  data={{
                    labels: (daily.data ?? []).map(d => d.day_name.slice(0, 3)),
                    datasets: [{
                      label: 'Avg Order ($)',
                      data: (daily.data ?? []).map(d => Number(d.avg_order_value).toFixed(2)),
                      backgroundColor: 'rgba(0,181,164,.15)',
                      borderColor: T.teal,
                      borderWidth: 2, borderRadius: 7,
                    }],
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: TICK, font: { size: 10 } } },
                      y: { grid: { color: GRID },    ticks: { color: TICK, font: { size: 10 } } },
                    },
                    animation: { duration: 600 },
                  }}
                />
              </div>
            )}
          </Card>

          {/* Revenue donut */}
          <Card>
            <CardTitle>Revenue by Truck</CardTitle>
            {revenue.isLoading ? <LoadingState /> : (
              <div style={{ height: 155 }}>
                <Doughnut
                  data={{
                    labels: (revenue.data ?? []).map(t => t.truck_name.split(' ')[0]),
                    datasets: [{
                      data: (revenue.data ?? []).map(t => t.total_revenue),
                      backgroundColor: COLORS,
                      borderWidth: 3, borderColor: T.white,
                    }],
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                    plugins: { legend: { labels: { color: T.txt2, font: { size: 10 }, boxWidth: 10 } } },
                    animation: { duration: 600 },
                  }}
                />
              </div>
            )}
          </Card>
        </div>

        {/* ── Bottom row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Revenue table */}
          <Card>
            <CardTitle>
              Revenue per Truck
              <span style={{ fontSize: 11, color: T.txt3, fontWeight: 500 }}>Last 30 days</span>
            </CardTitle>
            {revenue.isLoading ? <LoadingState /> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Truck', 'Orders', 'Revenue', 'Avg Order'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '5px 0', fontSize: 9, color: T.txt3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', borderBottom: `1.5px solid ${T.bdr}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(revenue.data ?? []).map(r => (
                    <tr key={r.truck_name}>
                      <td style={{ padding: '9px 0', borderBottom: `1px solid ${GRID}`, fontSize: 13, fontWeight: 700 }}>🚚 {r.truck_name}</td>
                      <td style={{ padding: '9px 0', borderBottom: `1px solid ${GRID}`, color: T.txt2 }}>{r.order_count}</td>
                      <td style={{ padding: '9px 0', borderBottom: `1px solid ${GRID}` }}><Money value={r.total_revenue} /></td>
                      <td style={{ padding: '9px 0', borderBottom: `1px solid ${GRID}` }}><Money value={r.avg_order_value} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {/* Top dishes */}
          <Card>
            <CardTitle>
              Top Dishes
              <span style={{ fontSize: 11, color: T.txt3, fontWeight: 500 }}>By qty sold</span>
            </CardTitle>
            {topDishes.isLoading ? <LoadingState /> : (
              <div>
                {(topDishes.data ?? []).slice(0, 7).map((d, i) => (
                  <div key={d.dish_name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: `1px solid ${GRID}`, fontSize: 13,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: T.txt3, fontFamily: 'var(--mono)', fontSize: 10, width: 16 }}>#{i + 1}</span>
                      🍽️ <span style={{ fontWeight: 600 }}>{d.dish_name}</span>
                    </span>
                    <Mono style={{ color: T.tealDark, fontWeight: 700 }}>{d.total_qty} sold</Mono>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </PageContent>
    </>
  )
}
