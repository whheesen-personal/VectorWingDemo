'use client'

import React from 'react'
import TopNav from '../../components/TopNav'
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material'

type RepeaterEvent = {
  id: string
  start: string
  end: string
  instr: string
  student: string
  task: string
  asset: string
  details?: string
  status: string
}

const mockEvents: RepeaterEvent[] = [
  { id: 'evt-1', start: '06:20', end: '06:50', instr: 'INSTR-01', student: '—', task: 'PLANNER', asset: '—', details: '', status: 'PLN' },
  { id: 'evt-2', start: '07:00', end: '09:00', instr: 'INSTR-02', student: 'STU-01', task: 'PB IF2', asset: '—', details: 'STU-01,STU-02', status: 'EWD' },
  { id: 'evt-3', start: '08:30', end: '09:00', instr: 'INSTR-03', student: 'STU-03', task: 'MEETING', asset: '—', status: 'MTG' },
  { id: 'evt-4', start: '09:15', end: '10:00', instr: 'INSTR-04', student: 'STU-04', task: 'GH', asset: 'SIM 2', status: 'ADD' },
  { id: 'evt-5', start: '10:00', end: '10:30', instr: 'INSTR-05', student: 'STU-05', task: 'IPT GH9', asset: 'SIM 1', status: 'ADD' },
  { id: 'evt-6', start: '10:30', end: '11:00', instr: 'INSTR-06', student: 'STU-03', task: 'GH15PLUS', asset: 'SIM 1', status: 'ADD' },
  { id: 'evt-7', start: '11:00', end: '11:25', instr: 'INSTR-07', student: 'STU-06', task: 'IPT IF2', asset: 'SIM 2', status: 'ADD' },
  { id: 'evt-8', start: '11:00', end: '11:25', instr: 'INSTR-08', student: 'STU-07', task: 'IPT GH9', asset: 'SIM 5', status: 'ADD' },
  { id: 'evt-9', start: '11:00', end: '11:25', instr: 'INSTR-02', student: 'STU-08', task: 'FTD IF4', asset: 'SIM 1', status: 'ADD' },
  { id: 'evt-10', start: '11:05', end: '11:20', instr: 'ALERT', student: '—', task: 'EMERG', asset: '—', status: 'EMERG' },
  { id: 'evt-11', start: '12:00', end: '12:20', instr: 'INSTR-09', student: 'WEEKLY BRIEF', task: '—', asset: '—', details: 'PAX-01, PAX-02, PAX-03, PAX-04, PAX-05', status: 'SP PR' },
  { id: 'evt-12', start: '14:30', end: '15:00', instr: 'INSTR-10', student: '—', task: 'SOF', asset: '—', status: 'SOF' },
  { id: 'evt-13', start: '16:00', end: '17:15', instr: 'INSTR-11', student: 'STU-09', task: 'IPT GH9', asset: 'SIM 1', status: 'ADD' },
  { id: 'evt-14', start: '16:00', end: '17:15', instr: 'INSTR-12', student: 'STU-10', task: 'IPT GH9', asset: 'SIM 2', status: 'ADD' },
  { id: 'evt-15', start: '16:00', end: '17:15', instr: 'INSTR-13', student: 'STU-11', task: 'IPT GH9', asset: 'SIM 3', status: 'ADD' },
  { id: 'evt-16', start: '16:00', end: '17:15', instr: 'INSTR-14', student: 'STU-06', task: 'FTD GH11', asset: 'SIM 2', status: 'ADD' },
  { id: 'evt-17', start: '16:00', end: '17:15', instr: 'INSTR-15', student: 'STU-12', task: 'FTD GH11', asset: 'SIM 3', status: 'ADD' },
  { id: 'evt-18', start: '16:00', end: '17:15', instr: 'INSTR-16', student: 'STU-13', task: 'FTD GH11', asset: 'SIM 1', status: 'ADD' },
  { id: 'evt-19', start: '16:00', end: '17:15', instr: 'INSTR-17', student: 'STU-14', task: 'FTD GH12', asset: 'SIM 3', status: 'ADD' },
]

const statusChip = (s: string) => {
  const map: Record<string, 'default' | 'success' | 'error' | 'info' | 'warning' | 'secondary'> = {
    ADD: 'success',
    EMERG: 'error',
    'SP PR': 'warning',
    EWD: 'info',
    SOF: 'secondary',
    MTG: 'secondary',
    PLN: 'info',
  }
  const color = map[s] ?? 'default'
  return <Chip size="small" label={s} color={color} sx={{ fontWeight: 800 }} />
}

function HeaderBar() {
  const [now, setNow] = React.useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  React.useEffect(() => {
    const i = setInterval(() => setNow(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000 * 30)
    return () => clearInterval(i)
  }, [])
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 2, py: 1.5, borderBottom: '1px solid #243049',
      background: 'linear-gradient(180deg, var(--panel) 0%, var(--panel-2) 100%)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Unit Ground Events</Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last updated: 09:12</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{now}</Typography>
      </Stack>
    </Box>
  )
}

export default function RepeaterPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="repeater" />
      <Container maxWidth={false} sx={{ px: { xs: 1, md: 2 }, py: 0 }}>
        <Box sx={{ mx: 'auto', maxWidth: 1400, border: '1px solid #243049', borderRadius: 1, overflow: 'hidden' }}>
          <HeaderBar />
          <Board />
        </Box>
      </Container>
    </Box>
  )
}

function Board() {
  const [events, setEvents] = React.useState<RepeaterEvent[]>(mockEvents)
  const [nowMinutes, setNowMinutes] = React.useState<number>(getNowMinutes())
  const [flashById, setFlashById] = React.useState<Record<string, 'update' | 'status' | undefined>>({})

  React.useEffect(() => {
    const i = setInterval(() => setNowMinutes(getNowMinutes()), 30 * 1000)
    return () => clearInterval(i)
  }, [])

  React.useEffect(() => {
    const i = setInterval(() => {
      setEvents((prev) => {
        const candidates = prev.filter((e) => parseTime(e.end) >= nowMinutes)
        if (candidates.length === 0) return prev
        const pick = candidates[Math.floor(Math.random() * candidates.length)]
        const op = Math.random()
        let next = prev.map((e) => ({ ...e }))
        const idx = next.findIndex((e) => e.id === pick.id)
        if (idx === -1) return prev
        if (op < 0.33) {
          // Toggle status between ADD and CXL
          next[idx].status = next[idx].status === 'CXL' ? 'ADD' : 'CXL'
          setFlashById((f) => ({ ...f, [pick.id]: 'status' }))
          setTimeout(() => setFlashById((f) => ({ ...f, [pick.id]: undefined })), 1500)
        } else if (op < 0.66) {
          // Shift time by -10..+10 minutes
          const delta = (Math.floor(Math.random() * 21) - 10) * 1 // minutes
          const ns = clampMinutes(parseTime(next[idx].start) + delta)
          const ne = Math.max(ns + 15, clampMinutes(parseTime(next[idx].end) + delta))
          next[idx].start = minutesToTime(ns)
          next[idx].end = minutesToTime(ne)
          // Mark as updated
          setFlashById((f) => ({ ...f, [pick.id]: 'update' }))
          setTimeout(() => setFlashById((f) => ({ ...f, [pick.id]: undefined })), 1500)
          // Re-sort by start time to simulate reordering
          next.sort((a, b) => parseTime(a.start) - parseTime(b.start))
        } else {
          // Change asset or instructor randomly
          if (Math.random() < 0.5) {
            next[idx].asset = next[idx].asset.startsWith('SIM') ? '—' : `SIM ${1 + Math.floor(Math.random() * 5)}`
          } else {
            next[idx].instr = `INSTR-${String(1 + Math.floor(Math.random() * 20)).padStart(2, '0')}`
          }
          setFlashById((f) => ({ ...f, [pick.id]: 'update' }))
          setTimeout(() => setFlashById((f) => ({ ...f, [pick.id]: undefined })), 1500)
        }
        return next
      })
    }, 10 * 1000)
    return () => clearInterval(i)
  }, [nowMinutes])

  const ordered = React.useMemo(() => events.slice().sort((a, b) => parseTime(a.start) - parseTime(b.start)), [events])

  return (
    <Box sx={{
      '--rowH': '40px',
      fontSize: 14,
      ['@media (max-width:900px) as any']: {},
    }}>
      <BoardHeader />
      <Divider sx={{ borderColor: '#243049' }} />
      <StyleInjection />
      {ordered.map((e, i) => (
        <Row key={e.id} e={e} odd={i % 2 === 1} nowMinutes={nowMinutes} flash={flashById[e.id]} />
      ))}
    </Box>
  )
}

function BoardHeader() {
  return (
    <Box sx={gridRowSx(true)}>
      <Cell>Start</Cell>
      <Cell>End</Cell>
      <Cell>Instr</Cell>
      <Cell sx={{ display: { xs: 'none', sm: 'block' } }}>Student</Cell>
      <Cell>Task</Cell>
      <Cell sx={{ display: { xs: 'none', sm: 'block' } }}>Asset</Cell>
      <Cell sx={{ display: { xs: 'none', md: 'block' } }}>Details</Cell>
      <Cell sx={{ textAlign: 'right' }}>Status</Cell>
    </Box>
  )
}

function Row({ e, odd, nowMinutes, flash }: { e: RepeaterEvent; odd: boolean; nowMinutes: number; flash?: 'update' | 'status' }) {
  const past = parseTime(e.end) < nowMinutes
  const emerg = e.status === 'EMERG'
  return (
    <Box sx={gridRowSx(false, odd, past)} className={`${emerg ? 'row-emerg' : ''} ${flash ? (flash === 'status' ? 'row-status-flash' : 'row-update-flash') : ''}`}>
      <Cell mono>{e.start}</Cell>
      <Cell mono>{e.end}</Cell>
      <Cell mono>{e.instr}</Cell>
      <Cell sx={{ display: { xs: 'none', sm: 'block' } }}>{e.student}</Cell>
      <Cell>{e.task}</Cell>
      <Cell sx={{ display: { xs: 'none', sm: 'block' } }}>{e.asset}</Cell>
      <Cell sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary' }}>{e.details || ''}</Cell>
      <Cell sx={{ textAlign: 'right' }}>{statusChip(e.status)}</Cell>
    </Box>
  )
}

function Cell({ children, sx, mono }: { children: React.ReactNode; sx?: any; mono?: boolean }) {
  return (
    <Box sx={{
      px: 1, py: 0.75, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      fontVariantNumeric: mono ? 'tabular-nums' : undefined,
      fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : undefined,
      ...sx,
    }}>
      {children}
    </Box>
  )
}

function gridRowSx(header = false, odd = false, past = false) {
  return {
    display: 'grid',
    gridTemplateColumns: '60px 60px 120px 1fr 140px 140px 1.5fr 120px',
    columnGap: 8,
    alignItems: 'center',
    background: odd ? 'rgba(255,255,255,0.02)' : 'transparent',
    borderBottom: '1px solid #1b263b',
    fontWeight: header ? 700 : 600,
    color: header ? 'text.secondary' : past ? 'text.secondary' : 'text.primary',
    opacity: past && !header ? 0.55 : 1,
    transition: 'transform 200ms ease, background-color 400ms ease, opacity 300ms ease',
    minHeight: 'var(--rowH)',
    // Portrait-friendly: collapse some columns on small screens
    '@media (max-width: 900px)': {
      gridTemplateColumns: '56px 56px 1fr 120px 1fr 100px',
      '& > :nth-of-type(4)': { display: 'none' }, // Student
      '& > :nth-of-type(6)': { display: 'none' }, // Asset
      '& > :nth-of-type(7)': { display: 'none' }, // Details
    },
  } as const
}

function StyleInjection() {
  return (
    <style jsx global>{`
      @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3) } 50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.12) } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3) } }
      @keyframes flashBg { 0% { background-color: rgba(56,189,248,0.2) } 100% { background-color: transparent } }
      @keyframes flashStatus { 0% { background-color: rgba(245,158,11,0.25) } 100% { background-color: transparent } }
      .row-emerg { animation: pulseGlow 2.5s ease-in-out infinite; }
      .row-update-flash { animation: flashBg 1.2s ease-out 1; }
      .row-status-flash { animation: flashStatus 1.2s ease-out 1; }
    `}</style>
  )
}

function parseTime(t: string) {
  const [h, m] = t.split(':').map((x) => parseInt(x, 10))
  return h * 60 + m
}

function minutesToTime(n: number) {
  const h = Math.floor(n / 60)
  const m = n % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function clampMinutes(n: number) {
  if (n < 0) return 0
  if (n > 23 * 60 + 59) return 23 * 60 + 59
  return n
}

function getNowMinutes() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}


