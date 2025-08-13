'use client'

import React from 'react'
import TopNav from '../../components/TopNav'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

const students = [
  { 
    name: 'Lt Sam Lee', 
    phase: 'Instruments', 
    progress: 45, 
    alerts: ['IFR check due in 14 days'],
    estimatedDaysRemaining: 28,
    modulesRemaining: ['IF5', 'IF6', 'IF7', 'IF8', 'IF9', 'IF10', 'IF11', 'IF12']
  },
  { 
    name: 'Lt Maria Gomez', 
    phase: 'Contact', 
    progress: 20, 
    alerts: [],
    estimatedDaysRemaining: 42,
    modulesRemaining: ['CT3', 'CT4', 'CT5', 'CT6', 'CT7', 'CT8', 'CT9', 'CT10']
  },
  { 
    name: 'Lt Alex Chen', 
    phase: 'Instruments', 
    progress: 62, 
    alerts: [],
    estimatedDaysRemaining: 18,
    modulesRemaining: ['IF8', 'IF9', 'IF10', 'IF11', 'IF12']
  },
  { 
    name: 'Lt Priya Singh', 
    phase: 'Contact', 
    progress: 38, 
    alerts: ['Contact check in 10 days'],
    estimatedDaysRemaining: 35,
    modulesRemaining: ['CT5', 'CT6', 'CT7', 'CT8', 'CT9', 'CT10']
  },
  { 
    name: "Lt James O'Neil", 
    phase: 'Instruments', 
    progress: 12, 
    alerts: [],
    estimatedDaysRemaining: 56,
    modulesRemaining: ['IF2', 'IF3', 'IF4', 'IF5', 'IF6', 'IF7', 'IF8', 'IF9', 'IF10', 'IF11', 'IF12']
  },
  { 
    name: 'Lt Sofia Rossi', 
    phase: 'Contact', 
    progress: 55, 
    alerts: [],
    estimatedDaysRemaining: 25,
    modulesRemaining: ['CT7', 'CT8', 'CT9', 'CT10']
  },
  { 
    name: 'Lt David Kim', 
    phase: 'Instruments', 
    progress: 27, 
    alerts: [],
    estimatedDaysRemaining: 48,
    modulesRemaining: ['IF4', 'IF5', 'IF6', 'IF7', 'IF8', 'IF9', 'IF10', 'IF11', 'IF12']
  },
  { 
    name: 'Lt Anna Kowalski', 
    phase: 'Contact', 
    progress: 47, 
    alerts: [],
    estimatedDaysRemaining: 30,
    modulesRemaining: ['CT6', 'CT7', 'CT8', 'CT9', 'CT10']
  },
]

export default function TrainingPage() {
  const [view, setView] = React.useState<'progress' | 'syllabus'>('syllabus')

  // --- Syllabus Board demo data ---
  type SyllabusStatus = 'pending' | 'scheduled' | 'in-progress' | 'done' | 'deferred' | 'waived'
  type SyllabusEvent = { id: string; code: string; duration: string; asset: string }

  const syllabusEvents: SyllabusEvent[] = React.useMemo(
    () => [
      { id: 'GH25', code: 'GH25', duration: '1:00', asset: 'PC21' },
      { id: 'BP-IF4', code: 'BP IF4', duration: '1:00', asset: 'FTD' },
      { id: 'IPT-IF5', code: 'IPT IF5', duration: '1:00', asset: 'FTD' },
      { id: 'FTD-IF9', code: 'FTD IF9', duration: '1:15', asset: 'FTD' },
      { id: 'FTD-IF10', code: 'FTD IF10', duration: '1:15', asset: 'FTD' },
      { id: 'IF11', code: 'IF11', duration: '1:15', asset: 'FTD' },
      { id: 'IF12', code: 'IF12', duration: '1:15', asset: 'FTD' },
    ],
    []
  )

  const buildInitialBoard = (): Record<string, Record<string, SyllabusStatus>> => {
    const board: Record<string, Record<string, SyllabusStatus>> = {}
    students.forEach((student, studentIndex) => {
      const row: Record<string, SyllabusStatus> = {}
      const totalEvents = syllabusEvents.length
      const doneCount = Math.min(
        totalEvents,
        Math.floor((student.progress / 100) * totalEvents)
      )

      syllabusEvents.forEach((event, eventIndex) => {
        let status: SyllabusStatus = 'pending'

        if (eventIndex < doneCount) {
          status = 'done'
        } else if (eventIndex === doneCount && doneCount < totalEvents) {
          status = 'in-progress'
        } else if (eventIndex === doneCount + 1 && doneCount + 1 < totalEvents) {
          status = 'scheduled'
        }

        // Sprinkle a couple of special cases to demonstrate breadth of statuses
        if (status !== 'done') {
          if (studentIndex % 4 === 0 && eventIndex === totalEvents - 2) status = 'deferred'
          if (studentIndex % 3 === 0 && eventIndex === totalEvents - 1) status = 'waived'
        }

        row[event.id] = status
      })

      board[student.name] = row
    })

    return board
  }

  const [board, setBoard] = React.useState<Record<string, Record<string, SyllabusStatus>>>(buildInitialBoard)
  const [phaseFilter, setPhaseFilter] = React.useState<'all' | 'contact' | 'instruments'>('all')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'scheduled' | 'in-progress' | 'done' | 'deferred' | 'waived'>('all')

  const cycleStatus = (status: SyllabusStatus): SyllabusStatus => {
    switch (status) {
      case 'pending':
        return 'scheduled'
      case 'scheduled':
        return 'in-progress'
      case 'in-progress':
        return 'done'
      case 'done':
        return 'deferred'
      case 'deferred':
        return 'waived'
      case 'waived':
      default:
        return 'pending'
    }
  }

  const statusColor = (
    status: SyllabusStatus
  ): 'default' | 'info' | 'success' | 'warning' | 'secondary' => {
    if (status === 'scheduled') return 'info'
    if (status === 'in-progress') return 'secondary'
    if (status === 'done') return 'success'
    if (status === 'deferred') return 'warning'
    if (status === 'waived') return 'warning'
    return 'default'
  }

  const visibleStudents = students.filter((s) => {
    if (phaseFilter === 'all') return true
    if (phaseFilter === 'contact') return s.phase.toLowerCase().includes('contact')
    if (phaseFilter === 'instruments') return s.phase.toLowerCase().includes('instrument')
    return true
  })

  const matchesStatusFilter = (studentName: string): boolean => {
    if (statusFilter === 'all') return true
    const statuses = Object.values(board[studentName] || {})
    return statuses.some((st) => st === statusFilter)
  }

  const resetBoard = () => setBoard(buildInitialBoard())
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="training" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {view === 'progress' ? 'Student Progress' : 'Syllabus Board'}
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={view}
                    onChange={(_e, v) => v && setView(v)}
                    sx={{ ml: 'auto' }}
                  >
                    <ToggleButton value="syllabus">Syllabus</ToggleButton>
                    <ToggleButton value="progress">Progress</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {view === 'progress' && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {students.map((s) => (
                      <Card key={s.name} variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography sx={{ fontWeight: 700 }}>{s.name}</Typography>
                              <Chip label={s.phase} size="small" />
                            </Stack>
                            <LinearProgress variant="determinate" value={s.progress} />
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip label={`Progress ${s.progress}%`} size="small" color="info" />
                              <Chip label={`${s.estimatedDaysRemaining} days remaining`} size="small" color="primary" />
                              <Chip label={`${s.modulesRemaining.length} modules left`} size="small" color="secondary" />
                            </Stack>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Modules remaining:
                              </Typography>
                              {s.modulesRemaining.slice(0, 6).map((module) => (
                                <Chip 
                                  key={module} 
                                  label={module} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {s.modulesRemaining.length > 6 && (
                                <Chip 
                                  label={`+${s.modulesRemaining.length - 6} more`} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Stack>
                            {s.alerts.length > 0 && (
                              <Stack direction="row" spacing={1}>
                                {s.alerts.map((a) => (
                                  <Chip key={a} label={a} size="small" color="warning" variant="outlined" />
                                ))}
                              </Stack>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}

                {view === 'syllabus' && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Course: BFT FW13</Typography>
                      <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">Legend:</Typography>
                        <Chip size="small" label="Pending" />
                        <Chip size="small" color="info" label="Scheduled" />
                        <Chip size="small" color="secondary" label="In-Progress" />
                        <Chip size="small" color="success" label="Done" />
                        <Chip size="small" color="warning" label="Deferred" />
                        <Chip size="small" color="warning" label="Waived" />
                      </Stack>
                      <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Phase</InputLabel>
                        <Select
                          label="Phase"
                          value={phaseFilter}
                          onChange={(e) => setPhaseFilter(e.target.value as typeof phaseFilter)}
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="contact">Contact</MenuItem>
                          <MenuItem value="instruments">Instruments</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 170 }}>
                        <InputLabel>Show</InputLabel>
                        <Select
                          label="Show"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        >
                          <MenuItem value="all">All statuses</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="scheduled">Scheduled</MenuItem>
                          <MenuItem value="in-progress">In-Progress</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
                          <MenuItem value="deferred">Deferred</MenuItem>
                          <MenuItem value="waived">Waived</MenuItem>
                        </Select>
                      </FormControl>
                      <Chip
                        label="Reset"
                        size="small"
                        variant="outlined"
                        onClick={resetBoard}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Stack>

                    <Box sx={{ overflowX: 'auto', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: 'background.paper' }}>Student</TableCell>
                            {syllabusEvents.map((ev) => (
                              <TableCell
                                key={ev.id}
                                align="center"
                                sx={{ whiteSpace: 'nowrap', fontWeight: 700, backgroundColor: 'background.paper' }}
                              >
                                <Stack alignItems="center" spacing={0.5}>
                                  <Typography variant="body2">{ev.code}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {ev.duration} · {ev.asset}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visibleStudents
                            .filter((s) => matchesStatusFilter(s.name))
                            .map((s) => (
                              <TableRow key={s.name} hover>
                                <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>{s.name}</TableCell>
                                {syllabusEvents.map((ev) => {
                                  const current = board[s.name]?.[ev.id] ?? 'pending'
                                  return (
                                    <TableCell
                                      key={ev.id}
                                      align="center"
                                      sx={{ cursor: 'pointer', p: 0.5 }}
                                      onClick={() =>
                                        setBoard((prev) => ({
                                          ...prev,
                                          [s.name]: {
                                            ...prev[s.name],
                                            [ev.id]: cycleStatus(prev[s.name][ev.id]),
                                          },
                                        }))
                                      }
                                    >
                                      <Chip size="small" label={current} color={statusColor(current)} sx={{ textTransform: 'capitalize' }} />
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {view === 'progress' && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AssignmentTurnedInIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Upcoming Evaluations</Typography>
                  </Stack>
                  <List>
                    <ListItem>
                      <ListItemText primary="Instrument Check – Lt Sam Lee" secondary="Thu 10:00, IP: Capt Hunter" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Contact Progress Ride – Lt Maria Gomez" secondary="Fri 13:30, IP: Maj Park" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}


