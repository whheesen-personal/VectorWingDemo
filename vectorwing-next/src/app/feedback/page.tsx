'use client'

import TopNav from '../../components/TopNav'
import { useAppStore } from '../../state/store'
import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Paper,
  Slider,
  IconButton,
  Tooltip,
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import jsPDF from 'jspdf'
// @ts-ignore
import autoTable from 'jspdf-autotable'

type MissionTask = {
  id: string
  category: string
  title: string
  min?: number
  grade?: number | ''
  comments?: string
}

const DEFAULT_TASKS: MissionTask[] = [
  // GENERAL
  { id: 't1', category: 'GENERAL', title: 'Sortie Preparation', min: 2, grade: 0 },
  { id: 't2', category: 'GENERAL', title: 'Ground Operations', min: 2, grade: 0 },
  { id: 't3', category: 'GENERAL', title: 'In-Flight Checks', min: 2, grade: 0 },
  { id: 't4', category: 'GENERAL', title: 'Avionics Management', min: 2, grade: 0 },
  { id: 't5', category: 'GENERAL', title: 'R/T (Radios/Comms)', min: 2, grade: 0 },
  { id: 't6', category: 'GENERAL', title: 'SA / Airmanship', min: 2, grade: 0 },
  { id: 't7', category: 'GENERAL', title: 'General Knowledge', min: 2, grade: 0 },
  { id: 't8', category: 'GENERAL', title: 'Flight Safety', min: 2, grade: 0 },
  // SORTIE SPECIFIC AREAS
  { id: 't9', category: 'SORTIE SPECIFIC AREAS', title: 'Take-off', min: 2, grade: 0 },
  { id: 't10', category: 'SORTIE SPECIFIC AREAS', title: 'Departure', min: 2, grade: 0 },
  { id: 't11', category: 'SORTIE SPECIFIC AREAS', title: 'Climb / Level-off', min: 2, grade: 0 },
  { id: 't12', category: 'SORTIE SPECIFIC AREAS', title: 'Arrival / Recovery', min: 2, grade: 0 },
  { id: 't13', category: 'SORTIE SPECIFIC AREAS', title: 'Approach / IAP', min: 2, grade: 0 },
  { id: 't14', category: 'SORTIE SPECIFIC AREAS', title: 'Landing', min: 2, grade: 0 },
  // BASIC AIRCRAFT CONTROL
  { id: 't15', category: 'BASIC AIRCRAFT CONTROL', title: 'Turns', min: 2, grade: 0 },
  { id: 't16', category: 'BASIC AIRCRAFT CONTROL', title: 'Steep Turns', min: 2, grade: 0 },
  { id: 't17', category: 'BASIC AIRCRAFT CONTROL', title: 'Pitch / Power Control', min: 2, grade: 0 },
]

function useGroupedTasks(tasks: MissionTask[]) {
  return useMemo(() => {
    const groups: Record<string, MissionTask[]> = {}
    tasks.forEach((t) => {
      if (!groups[t.category]) groups[t.category] = []
      groups[t.category].push(t)
    })
    return groups
  }, [tasks])
}

export default function FeedbackPage() {
  const { missions, groups } = useAppStore()
  const awaiting = useMemo(() => missions.filter((m) => m.status !== 'Canceled'), [missions])
  const [selectedId, setSelectedId] = useState<string | null>(awaiting[0]?.id || null)
  const selected = useMemo(() => awaiting.find((m) => m.id === selectedId) || null, [awaiting, selectedId])

  const [header, setHeader] = useState({
    courseTitle: 'BFT FW13 - INSTRUMENT FLYING MISSION',
    student: '',
    studentRank: '',
    missionNo: '',
    missionType: '',
    time: '',
    instructor: '',
    instructorRank: '',
    aircraftTail: '',
    ip: '',
    outcome: 'DCO',
    date: new Date().toISOString().slice(0, 10),
    runway: '',
    score: '',
  })
  const [remarks, setRemarks] = useState('')
  const [tasks, setTasks] = useState<MissionTask[]>(DEFAULT_TASKS)
  const grouped = useGroupedTasks(tasks)

  // Live, non-committed slider values to keep UI snappy; totals recalc only on commit
  const [liveGrades, setLiveGrades] = useState<Record<string, number>>({})
  useEffect(() => {
    const next: Record<string, number> = {}
    tasks.forEach((t) => { next[t.id] = typeof t.grade === 'number' ? t.grade : 0 })
    setLiveGrades(next)
  }, [tasks])

  const totals = useMemo(() => {
    const pointsScored = tasks.reduce((sum, t) => sum + (typeof t.grade === 'number' ? t.grade : 0), 0)
    const maxPoints = tasks.length * 10
    const percent = maxPoints > 0 ? Math.round((pointsScored / maxPoints) * 1000) / 10 : 0
    return { pointsScored, maxPoints, percent }
  }, [tasks])

  useEffect(() => {
    if (!selected) return
    const durMin = Math.max(0, Math.round((+selected.end - +selected.start) / 60000))
    setHeader((h) => ({
      ...h,
      student: h.student,
      missionNo: selected.id,
      missionType: selected.title,
      time: `${Math.floor(durMin / 60)}:${String(durMin % 60).padStart(2, '0')}`,
    }))
  }, [selected])

  const handleTaskChange = (id: string, field: keyof MissionTask, value: unknown) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } as MissionTask : t)))
  }

  const addTask = (category: string) => {
    const count = tasks.length + 1
    setTasks((prev) => ([
      ...prev,
      { id: `t${count}`, category, title: 'New Item', min: 1, grade: 0, comments: '' },
    ]))
  }

  const removeLastTaskIn = (category: string) => {
    const lastInCategory = [...tasks].reverse().find((t) => t.category === category)
    if (!lastInCategory) return
    setTasks((prev) => prev.filter((t) => t !== lastInCategory))
  }

  const generatePdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFont('helvetica', 'bold'); doc.setFontSize(14)
    doc.text(header.courseTitle || 'Mission Feedback Report', pageWidth / 2, 40, { align: 'center' })
    doc.setFontSize(10); doc.setFont('helvetica', 'normal')

    const leftCol = 40; const rightCol = pageWidth / 2 + 10
    const row = (label: string, value: string, y: number, x = leftCol) => {
      doc.setFont('helvetica', 'bold'); doc.text(label, x, y)
      doc.setFont('helvetica', 'normal'); doc.text(value || '-', x + 135, y)
    }
    row('Student:', header.student, 70)
    row('Rank:', header.studentRank, 88)
    row('Instructor:', header.instructor, 106)
    row('Rank:', header.instructorRank, 124)
    row('Date:', header.date, 142)
    row('Mission #:', header.missionNo, 70, rightCol)
    row('Type:', header.missionType, 88, rightCol)
    row('Time:', header.time, 106, rightCol)
    row("A/C Tail #:", header.aircraftTail, 124, rightCol)
    row('Mission Outcome:', header.outcome, 142, rightCol)
    row('Overall Score:', `${totals.percent}% (${totals.pointsScored}/${totals.maxPoints})`, 160, rightCol)

    const headerBottomY = 180
    autoTable(doc, {
      startY: headerBottomY,
      head: [["Task", "Category / Item", "Min", "Grade", "Comments"]],
      body: Object.keys(grouped).flatMap((cat) => [
        [{ content: `— ${cat} —`, colSpan: 5, styles: { fillColor: [245,245,245], fontStyle: 'bold' } } as any],
        ...grouped[cat].map((t, i) => [String(i + 1), t.title, t.min ?? '', t.grade === '' ? '' : String(t.grade), t.comments ?? ''])
      ]),
      styles: { fontSize: 9 },
      theme: 'grid',
    })

    const y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : headerBottomY + 30
    doc.setFont('helvetica', 'bold'); doc.text('Overall Remarks', 40, y)
    doc.setFont('helvetica', 'normal');
    const remarksWithRwy = `${header.runway ? `RWY ${header.runway}` : ''}\n\n${remarks || '-'}`
    doc.text(doc.splitTextToSize(remarksWithRwy, pageWidth - 80), 40, y + 16)

    // IP signature line
    const ipLineY = y + 16 + 16 * 6
    doc.setFont('helvetica', 'normal');
    doc.text(`IP: ${header.ip || ''}`, 40, ipLineY)

    doc.save(`mission-feedback-${header.student || selected?.id || 'report'}.pdf`)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="feedback" />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <RateReviewIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Mission Feedback</Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Awaiting Completion</Typography>
                <Paper variant="outlined" sx={{ maxHeight: 520, overflow: 'auto' }}>
                  <List dense>
                    {awaiting.map((m) => (
                      <ListItemButton key={m.id} selected={m.id === selectedId} onClick={() => setSelectedId(m.id)}>
                        <ListItemText primary={m.title} secondary={`${m.group} • ${new Date(m.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(m.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                        <Chip size="small" label={m.status} color={m.status === 'Authorized' ? 'success' : 'info'} variant="outlined" />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth label="Course Title" value={header.courseTitle} onChange={(e) => setHeader({ ...header, courseTitle: e.target.value })} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Student" value={header.student} onChange={(e) => setHeader({ ...header, student: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Student Rank" value={header.studentRank} onChange={(e) => setHeader({ ...header, studentRank: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Mission #" value={header.missionNo} onChange={(e) => setHeader({ ...header, missionNo: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Type" value={header.missionType} onChange={(e) => setHeader({ ...header, missionType: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Time" value={header.time} onChange={(e) => setHeader({ ...header, time: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Outcome" value={header.outcome} onChange={(e) => setHeader({ ...header, outcome: e.target.value })} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Instructor" value={header.instructor} onChange={(e) => setHeader({ ...header, instructor: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Instructor Rank" value={header.instructorRank} onChange={(e) => setHeader({ ...header, instructorRank: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth type="date" label="Date" value={header.date} onChange={(e) => setHeader({ ...header, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Score" value={`${totals.percent}% (${totals.pointsScored}/${totals.maxPoints})`} InputProps={{ readOnly: true }} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Runway" value={header.runway} onChange={(e) => setHeader({ ...header, runway: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="A/C Tail #" value={header.aircraftTail} onChange={(e) => setHeader({ ...header, aircraftTail: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="IP" value={header.ip} onChange={(e) => setHeader({ ...header, ip: e.target.value })} /></Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <TextField label="Overall Remarks" multiline minRows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} fullWidth />
              </CardContent>
            </Card>

            <Box sx={{ height: 12 }} />

            <Card>
              <CardContent>
                {Object.keys(grouped).map((cat) => (
                  <Box key={cat} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{cat}</Typography>
                    </Stack>
                    <Grid container spacing={1}>
                      {grouped[cat].map((t) => (
                        <Grid item xs={12} key={t.id}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} md={5}><TextField fullWidth label="Item" value={t.title} onChange={(e) => handleTaskChange(t.id, 'title', e.target.value)} /></Grid>
                            <Grid item xs={4} md={2}><TextField fullWidth type="number" label="Min" value={t.min ?? ''} onChange={(e) => handleTaskChange(t.id, 'min', Number(e.target.value))} /></Grid>
                            <Grid item xs={8} md={4}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Slider
                                  value={liveGrades[t.id] ?? (typeof t.grade === 'number' ? t.grade : 0)}
                                  onChange={(_, v) => setLiveGrades((prev) => ({ ...prev, [t.id]: Number(v) }))}
                                  onChangeCommitted={(_, v) => handleTaskChange(t.id, 'grade', Number(v))}
                                  valueLabelDisplay="auto"
                                  step={1}
                                  marks={[0,5,10].map((g) => ({ value: g, label: String(g) }))}
                                  min={0}
                                  max={10}
                                  sx={{ flex: 1, minWidth: 140 }}
                                />
                                <Button size="small" variant="outlined" onClick={() => { setLiveGrades((prev) => ({ ...prev, [t.id]: 0 })); handleTaskChange(t.id, 'grade', 0) }}>Clear</Button>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ flex: 1 }}>
                                  <TextField fullWidth label="Comments" value={t.comments || ''} onChange={(e) => handleTaskChange(t.id, 'comments', e.target.value)} />
                                </Box>
                                <Tooltip title="Remove Task"><span><IconButton color="error" onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}><RemoveCircleOutlineIcon /></IconButton></span></Tooltip>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                      <Tooltip title="Add Task to Section"><span><IconButton color="primary" onClick={() => addTask(cat)}><AddCircleOutlineIcon /></IconButton></span></Tooltip>
                    </Stack>
                  </Box>
                ))}
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="subtitle2">Total: {totals.pointsScored} / {totals.maxPoints} — {totals.percent}%</Typography>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={generatePdf}>Generate PDF</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}


