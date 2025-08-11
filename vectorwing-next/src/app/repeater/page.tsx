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
  { start: '06:20', end: '06:50', instr: 'AZZA', student: '—', task: 'PLANNER', asset: '—', details: '', status: 'PLN' },
  { start: '07:00', end: '09:00', instr: 'FRANC', student: 'F13LASWAD', task: 'PB IF2', asset: '—', details: 'F13LASWAD,F13SHAHWANI', status: 'EWD' },
  { start: '08:30', end: '09:00', instr: 'BGEN KAYED', student: 'F13HAJRI', task: 'MEETING', asset: '—', status: 'MTG' },
  { start: '09:15', end: '10:00', instr: 'F13HAJRI', student: 'JUST', task: 'GH', asset: 'IPT 2', status: 'ADD' },
  { start: '10:00', end: '10:30', instr: 'BOZEN', student: 'F13QUBASI', task: 'IPT GH9', asset: 'IPT 1', status: 'ADD' },
  { start: '10:30', end: '11:00', instr: 'NATE', student: 'F13HAJRI', task: 'GH15PLUS', asset: 'IPT 1', status: 'ADD' },
  { start: '11:00', end: '11:25', instr: 'OLIVER', student: 'F13MASOUD', task: 'IPT IF2', asset: 'IPT 2', status: 'ADD' },
  { start: '11:00', end: '11:25', instr: 'TYLER', student: 'F13MUBARAK', task: 'IPT GH9', asset: 'IPT 5', status: 'ADD' },
  { start: '11:00', end: '11:25', instr: 'FRANC', student: 'F13MAHJOB', task: 'FTD IF4', asset: 'FTD 1', status: 'ADD' },
  { start: '11:05', end: '11:20', instr: 'ADC FAIL', student: '—', task: 'EMERG', asset: '—', status: 'EMERG' },
  { start: '12:00', end: '12:20', instr: 'OZ', student: 'WEEKLY BRIEF', task: '—', asset: '—', details: 'GOOSE, IVAN, MARC, NATE, OZ', status: 'SP PR' },
  { start: '14:30', end: '15:00', instr: 'TOBY', student: '—', task: 'SOF', asset: '—', status: 'SOF' },
  { start: '16:00', end: '17:15', instr: 'DICKIE', student: 'F13FAISAL', task: 'IPT GH9', asset: 'IPT 1', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'WERNER', student: 'F13HAMMADI', task: 'IPT GH9', asset: 'IPT 2', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'SMUTS', student: 'F13KHALID', task: 'IPT GH9', asset: 'IPT 3', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'TELLO', student: 'F13MASOUD', task: 'FTD GH11', asset: 'FTD 2', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'LUCA', student: 'F13AZIZ', task: 'FTD GH11', asset: 'FTD 3', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'NICO', student: 'F13YOUSEF', task: 'FTD GH11', asset: 'FTD 1', status: 'ADD' },
  { start: '16:00', end: '17:15', instr: 'GOOSE', student: 'F13HAMAD', task: 'FTD GH12', asset: 'FTD 3', status: 'ADD' },
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
      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>31 SQN Ground Events</Typography>
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
  return (
    <Box sx={{
      '--rowH': '40px',
      fontSize: 14,
      ['@media (max-width:900px) as any']: {},
    }}>
      <BoardHeader />
      <Divider sx={{ borderColor: '#243049' }} />
      {mockEvents.map((e, i) => (
        <Row key={i} e={e} odd={i % 2 === 1} />
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

function Row({ e, odd }: { e: RepeaterEvent; odd: boolean }) {
  return (
    <Box sx={gridRowSx(false, odd)}>
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

function gridRowSx(header = false, odd = false) {
  return {
    display: 'grid',
    gridTemplateColumns: '60px 60px 120px 1fr 140px 140px 1.5fr 120px',
    columnGap: 8,
    alignItems: 'center',
    background: odd ? 'rgba(255,255,255,0.02)' : 'transparent',
    borderBottom: '1px solid #1b263b',
    fontWeight: header ? 700 : 600,
    color: header ? 'text.secondary' : 'text.primary',
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


