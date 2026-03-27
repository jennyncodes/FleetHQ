// ============================================================
// FleetHQ — UI Components (Light Teal Theme)
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react'

// ════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════
export const T = {
  teal:        '#00b5a4',
  teal2:       '#00ceba',
  tealLight:   '#e0f7f5',
  tealDark:    '#009688',
  navy:        '#1a2340',
  bg:          '#f4f6f9',
  white:       '#ffffff',
  txt:         '#2d3748',
  txt2:        '#718096',
  txt3:        '#a0aec0',
  bdr:         '#e8ecf0',
  bdr2:        '#d1d9e6',
  red:         '#fc8181',
  redDark:     '#c53030',
  amber:       '#f6ad55',
  amberDark:   '#b7791f',
  green:       '#48bb78',
  greenDark:   '#276749',
  blue:        '#4299e1',
  blueDark:    '#2b6cb0',
  purple:      '#9f7aea',
  purpleDark:  '#6b46c1',
  shadow:      '0 2px 12px rgba(0,0,0,.07)',
  shadow2:     '0 6px 28px rgba(0,0,0,.11)',
  r:           '12px',
  r2:          '16px',
}

// ════════════════════════════════════════════
// PILL
// ════════════════════════════════════════════
type PillVariant = 'teal'|'green'|'red'|'amber'|'blue'|'purple'|'gray'

const PILL_MAP: Record<string, PillVariant> = {
  Active:'teal', Confirmed:'green', Available:'green', Completed:'green', Paid:'green', High:'green',
  Pending:'amber', Preparing:'amber', Maintenance:'amber', Medium:'amber',
  Inactive:'red', Cancelled:'red', Low:'red',
  Ready:'blue',
  Gold:'amber', Platinum:'purple', Silver:'gray', Bronze:'gray',
}
const PILL_CSS: Record<PillVariant, React.CSSProperties> = {
  teal:   { background: T.tealLight, color: T.tealDark   },
  green:  { background: '#f0fff4',   color: T.greenDark  },
  red:    { background: '#fff5f5',   color: T.redDark    },
  amber:  { background: '#fffbeb',   color: T.amberDark  },
  blue:   { background: '#ebf8ff',   color: T.blueDark   },
  purple: { background: '#faf5ff',   color: T.purpleDark },
  gray:   { background: '#f7fafc',   color: T.txt2       },
}

export function Pill({ label }: { label: string }) {
  const v = PILL_MAP[label] ?? 'gray'
  return (
    <span style={{
      ...PILL_CSS[v],
      display:'inline-flex', alignItems:'center',
      padding:'3px 12px', borderRadius:24,
      fontSize:11, fontWeight:700, whiteSpace:'nowrap',
    }}>
      {label}
    </span>
  )
}

// ════════════════════════════════════════════
// BUTTON
// ════════════════════════════════════════════
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'ghost'|'edit'|'danger'|'success'|'outline'
  size?: 'sm'|'md'
}

const BTN_CSS: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background:T.teal,    color:'#fff',       border:'none',
             boxShadow:'0 4px 12px rgba(0,181,164,.25)' },
  outline: { background:'transparent', color:T.teal,   border:`1.5px solid ${T.teal}` },
  ghost:   { background:T.bg,      color:T.txt2,       border:`1.5px solid ${T.bdr}` },
  edit:    { background:'#ebf8ff', color:T.blueDark,   border:'1.5px solid #bee3f8' },
  danger:  { background:'#fff5f5', color:T.redDark,    border:'1.5px solid #fed7d7' },
  success: { background:'#f0fff4', color:T.greenDark,  border:'1.5px solid #c6f6d5' },
}

export function Button({ variant='ghost', size='md', style, children, ...props }: ButtonProps) {
  const base = BTN_CSS[variant]
  return (
    <button
      {...props}
      style={{
        ...base,
        display:'inline-flex', alignItems:'center', gap:6,
        padding: size==='sm' ? '0 12px' : '0 18px',
        height: size==='sm' ? 28 : 36,
        borderRadius:24,
        fontFamily:'var(--font)', fontSize: size==='sm' ? 11 : 13,
        fontWeight:700, transition:'all .15s', cursor:'pointer',
        whiteSpace:'nowrap', ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        if (variant==='primary') { el.style.background=T.teal2; el.style.transform='translateY(-1px)' }
        else if (variant==='outline') el.style.background=T.tealLight
        else if (variant==='edit')    el.style.background='#bee3f8'
        else if (variant==='danger')  el.style.background='#fed7d7'
        else el.style.borderColor=T.bdr2
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = (base as any).background ?? ''
        el.style.transform = ''
        el.style.borderColor = ''
      }}
    >
      {children}
    </button>
  )
}

// ════════════════════════════════════════════
// MONO + MONEY
// ════════════════════════════════════════════
export function Mono({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return <span style={{ fontFamily:'var(--mono)', fontSize:11, color:T.txt2, ...style }}>{children}</span>
}
export function Money({ value }: { value:number }) {
  return (
    <span style={{ fontFamily:'var(--mono)', fontSize:12, fontWeight:700, color:T.tealDark }}>
      ${Number(value??0).toFixed(2)}
    </span>
  )
}

// ════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════
const GRADS = [
  'linear-gradient(135deg,#00b5a4,#4299e1)',
  'linear-gradient(135deg,#9f7aea,#06b6d4)',
  'linear-gradient(135deg,#fc8181,#f6ad55)',
  'linear-gradient(135deg,#48bb78,#38b2ac)',
]
export function Avatar({ name, size=28 }: { name:string; size?:number }) {
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
  const g = GRADS[(name.charCodeAt(0)??0) % GRADS.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, background:g, color:'#fff',
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      fontSize:Math.floor(size*0.36), fontWeight:800 }}>
      {initials}
    </div>
  )
}

// ════════════════════════════════════════════
// SPINNER / LOADING / EMPTY
// ════════════════════════════════════════════
export function Spinner({ size=20 }: { size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0,
    border:`2.5px solid ${T.bdr}`, borderTopColor:T.teal,
    animation:'spin 0.8s linear infinite' }} />
}
export function LoadingState({ message='Loading…' }: { message?:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12,
      padding:'60px 20px', color:T.txt3, fontSize:13 }}>
      <Spinner />{message}
    </div>
  )
}
export function EmptyState({ icon, message }: { icon:string; message:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 20px', color:T.txt3 }}>
      <div style={{ fontSize:34, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:13, fontWeight:600 }}>{message}</div>
    </div>
  )
}

// ════════════════════════════════════════════
// ALERT BOX
// ════════════════════════════════════════════
export function AlertBox({ type='error', children }: { type?:'error'|'warn'; children:React.ReactNode }) {
  return (
    <div style={{
      background: type==='error' ? '#fff5f5' : '#fffbeb',
      border:     `1.5px solid ${type==='error' ? '#fed7d7' : '#feebc8'}`,
      color:      type==='error' ? T.redDark : T.amberDark,
      borderRadius:T.r, padding:'11px 15px', fontSize:13, fontWeight:600,
      marginBottom:12, lineHeight:1.5,
    }}>
      {children}
    </div>
  )
}

// ════════════════════════════════════════════
// STAT CARD (dashboard)
// ════════════════════════════════════════════
interface StatCardProps {
  icon:string; value:string|number; label:string
  delta?:string; deltaUp?:boolean; accentColor?:string
}
export function StatCard({ icon, value, label, delta, deltaUp=true, accentColor=T.teal }: StatCardProps) {
  return (
    <div
      style={{ background:T.white, border:`1px solid ${T.bdr}`, borderRadius:T.r2,
        padding:'18px 20px', position:'relative', overflow:'hidden',
        boxShadow:T.shadow, transition:'transform .2s, box-shadow .2s' }}
      onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.transform='translateY(-3px)'; el.style.boxShadow=T.shadow2 }}
      onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=T.shadow }}
    >
      <div style={{ position:'absolute', top:-14, right:-14, width:64, height:64,
        borderRadius:'50%', background:accentColor, opacity:0.12 }} />
      <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:26, fontWeight:800, fontFamily:'var(--mono)', color:T.txt, lineHeight:1, letterSpacing:-1 }}>{value}</div>
      <div style={{ fontSize:10, color:T.txt3, marginTop:4, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:700 }}>{label}</div>
      {delta && <div style={{ fontSize:12, marginTop:7, fontWeight:700, color:deltaUp?T.green:T.red }}>{delta}</div>}
    </div>
  )
}

// ════════════════════════════════════════════
// CARD + CARD TITLE
// ════════════════════════════════════════════
export function Card({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <div style={{ background:T.white, border:`1px solid ${T.bdr}`,
      borderRadius:T.r2, padding:20, boxShadow:T.shadow, ...style }}>
      {children}
    </div>
  )
}
export function CardTitle({ children }: { children:React.ReactNode }) {
  return (
    <div style={{ fontSize:14, fontWeight:800, marginBottom:14, color:T.txt,
      display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      {children}
    </div>
  )
}

// ════════════════════════════════════════════
// KPI MINI CARD
// ════════════════════════════════════════════
export function KpiCard({ value, label, color }: { value:string|number; label:string; color?:string }) {
  return (
    <div style={{ background:T.white, border:`1px solid ${T.bdr}`, borderRadius:T.r,
      padding:'14px 16px', boxShadow:T.shadow }}>
      <div style={{ fontSize:22, fontWeight:800, fontFamily:'var(--mono)', color:color??T.teal }}>{value}</div>
      <div style={{ fontSize:10, color:T.txt3, marginTop:3, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
    </div>
  )
}

// ════════════════════════════════════════════
// DATA TABLE
// ════════════════════════════════════════════
interface Column<T> { key:string; header:string; render?:(row:T)=>React.ReactNode; style?:React.CSSProperties }
interface DataTableProps<T> {
  columns:Column<T>[]; data:T[]; keyField:keyof T
  emptyIcon?:string; emptyMessage?:string; loading?:boolean
}
export function DataTable<T>({ columns, data, keyField, emptyIcon='📄', emptyMessage='No records found', loading }: DataTableProps<T>) {
  const wrap = (inner: React.ReactNode) => (
    <div style={{ background:T.white, border:`1px solid ${T.bdr}`, borderRadius:T.r2, boxShadow:T.shadow, overflow:'hidden' }}>
      {inner}
    </div>
  )
  if (loading) return wrap(<LoadingState />)
  return wrap(
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#f8fafc', borderBottom:`1.5px solid ${T.bdr}` }}>
            {columns.map(c=>(
              <th key={c.key} style={{ padding:'11px 16px', textAlign:'left', fontSize:10,
                textTransform:'uppercase', letterSpacing:'0.8px', color:T.txt3, fontWeight:700,
                whiteSpace:'nowrap', ...c.style }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length===0
            ? <tr><td colSpan={columns.length}><EmptyState icon={emptyIcon} message={emptyMessage} /></td></tr>
            : data.map(row=>(
              <tr key={String(row[keyField])} style={{ borderBottom:'1px solid #f1f5f9' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#f8fafc'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=''}>
                {columns.map(c=>(
                  <td key={c.key} style={{ padding:'11px 16px', fontSize:13, verticalAlign:'middle', ...c.style }}>
                    {c.render ? c.render(row) : String((row as Record<string,unknown>)[c.key]??'—')}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

// ════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════
export function Modal({ open, title, onClose, onSave, saving, children }:
  { open:boolean; title:string; onClose:()=>void; onSave:()=>void; saving?:boolean; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div onClick={e=>{ if(e.target===e.currentTarget)onClose() }}
      style={{ position:'fixed', inset:0, background:'rgba(26,35,64,.5)', backdropFilter:'blur(4px)',
        zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
        padding:16, animation:'fadeIn .2s ease' }}>
      <div style={{ background:T.white, borderRadius:20, width:540, maxWidth:'100%', maxHeight:'88vh',
        overflow:'hidden', display:'flex', flexDirection:'column',
        boxShadow:'0 20px 60px rgba(0,0,0,.15)', animation:'slideUp .2s ease' }}>
        <div style={{ padding:'20px 24px 16px', borderBottom:`1px solid ${T.bdr}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:T.white, borderRadius:'20px 20px 0 0' }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:T.txt }}>{title}</h3>
          <button onClick={onClose}
            style={{ background:'none', border:'none', color:T.txt3, fontSize:20,
              lineHeight:1, padding:'3px 7px', borderRadius:8, cursor:'pointer', fontFamily:'var(--font)' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=T.bg}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='none'}>
            ✕
          </button>
        </div>
        <div style={{ padding:'20px 24px', overflowY:'auto', flex:1 }}>{children}</div>
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${T.bdr}`,
          display:'flex', justifyContent:'flex-end', gap:10,
          background:T.white, borderRadius:'0 0 20px 20px' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave} disabled={saving}>
            {saving ? <><Spinner size={14} /> Saving…</> : 'Save Record'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// FORM HELPERS
// ════════════════════════════════════════════
export function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:10, fontWeight:700, color:T.txt2, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</label>
      {children}
    </div>
  )
}

const INPUT_BASE: React.CSSProperties = {
  background:T.bg, border:`1.5px solid ${T.bdr}`, borderRadius:T.r,
  padding:'9px 13px', color:T.txt, fontFamily:'var(--font)',
  fontSize:13, fontWeight:600, outline:'none', width:'100%', transition:'border .15s',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      style={{ ...INPUT_BASE, ...props.style }}
      onFocus={e=>(e.target.style.borderColor=T.teal)}
      onBlur={e=>(e.target.style.borderColor=T.bdr)} />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props}
      style={{ ...INPUT_BASE, cursor:'pointer', ...props.style }}
      onFocus={e=>(e.target.style.borderColor=T.teal)}
      onBlur={e=>(e.target.style.borderColor=T.bdr)} />
  )
}

export function FormRow({ children }: { children:React.ReactNode }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>{children}</div>
}
export function FormRowFull({ children }: { children:React.ReactNode }) {
  return <div style={{ marginBottom:12 }}>{children}</div>
}

// ════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════
interface ToastItem { id:number; message:string; type:'success'|'error' }
interface ToastCtx  { toast:(msg:string, type?:ToastItem['type'])=>void }
const ToastCtx = createContext<ToastCtx>({ toast:()=>{} })

export function ToastProvider({ children }: { children:React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toast = useCallback((message:string, type:ToastItem['type']='success') => {
    const id = Date.now()
    setToasts(p=>[...p, { id, message, type }])
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), 3000)
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div style={{ position:'fixed', bottom:22, right:22, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
        {toasts.map(t=>(
          <div key={t.id} style={{ background:T.white, borderRadius:12,
            borderLeft:`4px solid ${t.type==='success'?T.green:T.red}`,
            padding:'11px 18px', fontSize:13, fontWeight:700,
            boxShadow:'0 8px 28px rgba(0,0,0,.13)',
            display:'flex', alignItems:'center', gap:9, maxWidth:300,
            animation:'slideUp .25s ease' }}>
            <span style={{ fontSize:16 }}>{t.type==='success'?'✅':'🗑️'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() { return useContext(ToastCtx) }
