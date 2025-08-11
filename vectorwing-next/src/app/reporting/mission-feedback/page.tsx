'use client'

import TopNav from '../../../components/TopNav'
import { Box, Container, Grid, Card, CardContent, Typography, Stack, TextField, MenuItem, Button, Divider, IconButton, Tooltip } from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
// jsPDF AutoTable v5 exposes a function: autoTable(doc, options)
// Types are bundled, so we can import the function and call it directly.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Some environments need ts-ignore for the plugin import
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
  { id: 't1', category: 'GENERAL', title: 'Sortie Preparation', min: 2, grade: '', comments: '' },
  { id: 't2', category: 'GENERAL', title: 'Ground Operations', min: 2, grade: '', comments: '' },
  { id: 't3', category: 'GENERAL', title: 'In-Flight Checks', min: 2, grade: '', comments: '' },
  { id: 't4', category: 'GENERAL', title: 'Avionics Management', min: 2, grade: '', comments: '' },
  { id: 't5', category: 'GENERAL', title: 'R/T', min: 2, grade: '', comments: '' },
  { id: 't6', category: 'GENERAL', title: 'SA / Airmanship', min: 2, grade: '', comments: '' },
  { id: 't7', category: 'GENERAL', title: 'General Knowledge', min: 2, grade: '', comments: '' },
  { id: 't8', category: 'GENERAL', title: 'Flight Safety', min: 2, grade: '', comments: '' },
  { id: 't9', category: 'SORTIE SPECIFIC AREAS', title: 'Take-off', min: 2, grade: '', comments: '' },
  { id: 't10', category: 'SORTIE SPECIFIC AREAS', title: 'Departure', min: 2, grade: '', comments: '' },
  { id: 't11', category: 'BASIC AIRCRAFT CONTROL', title: 'Turns', min: 2, grade: '', comments: '' },
  { id: 't12', category: 'BASIC AIRCRAFT CONTROL', title: 'Steep Turns', min: 2, grade: '', comments: '' },
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

export default function MissionFeedbackReportPage() {
  const [header, setHeader] = useState({
    course: 'BFT FW13 - INSTRUMENT FLYING MISSION',
    runway: 'RWY 34',
    student: '',
    missionNo: '',
    missionType: 'FTD IF2',
    time: '1:15',
    instructor: '',
    outcome: 'DCO',
    date: new Date().toISOString().slice(0, 10),
    score: '76.0-76',
  })
  const [remarks, setRemarks] = useState(
    'Good mission. Solid improvement in the area work. SP is using power + attitude techniques well and seeing the results. Revision tasks like radial intercepts developing well.'
  )
  const [tasks, setTasks] = useState<MissionTask[]>(DEFAULT_TASKS)
  const grouped = useGroupedTasks(tasks)

  const handleTaskChange = (id: string, field: keyof MissionTask, value: unknown) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } as MissionTask : t)))
  }

  const addTask = (category: string) => {
    const count = tasks.length + 1
    setTasks((prev) => [
      ...prev,
      { id: `t${count}`, category, title: 'New Item', min: 1, grade: '', comments: '' },
    ])
  }

  const removeLastTaskIn = (category: string) => {
    const idx = [...tasks].reverse().find((t) => t.category === category)
    if (!idx) return
    setTasks((prev) => prev.filter((t) => t !== idx))
  }

  const generatePdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(header.course, pageWidth / 2, 40, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const leftCol = 40
    const rightCol = pageWidth / 2 + 10

    const row = (label: string, value: string, y: number, x = leftCol) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, x, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value || '-', x + 135, y)
    }

    row('Student:', header.student, 70)
    row('Rank:', '', 88)
    row('Instructor:', header.instructor, 106)
    row('Rank:', '', 124)
    row('Date:', header.date, 142)

    row('Mission #:', header.missionNo, 70, rightCol)
    row('Mission Time:', header.time, 88, rightCol)
    row('A/C Tail #:', '', 106, rightCol)
    row('Mission Outcome:', header.outcome, 124, rightCol)
    row('Overall Score:', header.score, 142, rightCol)

    // Overall remarks
    doc.setFont('helvetica', 'bold')
    doc.text('Overall Remarks:', 40, 180)
    doc.setFont('helvetica', 'normal')
    const remarksText = `${header.runway}\n\n${remarks}`
    const remarksLines = doc.splitTextToSize(remarksText, pageWidth - 80)
    doc.text(remarksLines, 40, 198)

    // Flight Allocation mini table
    autoTable(doc, {
      startY: 270,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], halign: 'left' },
      bodyStyles: { valign: 'middle' },
      head: [[
        'Hours Code', 'Type', 'Description', 'Name', 'Hours'
      ]],
      body: [[
        '1008', 'Eff.', 'BFT', `${header.student ? header.student + ' / ' : ''}${header.instructor}`, header.time
      ]],
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50 },
        2: { cellWidth: 120 },
        3: { cellWidth: pageWidth - 80 - 70 - 50 - 120 - 60 },
        4: { cellWidth: 60 },
      },
    })

    // Tasks table
    const taskRows: Array<Array<string | number>> = []
    let taskIndex = 1
    Object.keys(grouped).forEach((category) => {
      taskRows.push([`— ${category} —`, '', '', '', '', '', '', ''])
      grouped[category].forEach((t) => {
        taskRows.push([
          String(taskIndex++),
          t.title,
          t.min ?? '',
          '', // M indicator
          t.grade === '' ? '' : String(t.grade),
          '', '', '',
        ])
      })
    })

    autoTable(doc, {
      startY: (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 330,
      theme: 'grid',
      styles: { fontSize: 9 },
      head: [["Task", "Category / Item", "Min", "D", "Grade", "1", "2", "3", "4", "5", "Comments"]],
      body: taskRows.map((r) => {
        if (String(r[0]).startsWith('—')) {
          return [{ content: r[0] as string, colSpan: 11, styles: { fillColor: [245, 245, 245], fontStyle: 'bold' } } as any]
        }
        return [r[0], r[1], r[2], r[3], r[4], '', '', '', '', '', '']
      }),
      columnStyles: {
        0: { cellWidth: 36 },
        1: { cellWidth: 180 },
        2: { cellWidth: 36 },
        3: { cellWidth: 24 },
        4: { cellWidth: 40 },
        10: { cellWidth: pageWidth - 80 - 36 - 180 - 36 - 24 - 40 - (24 * 5) },
      },
      didDrawPage: (data) => {
        // Title for tasks table
        doc.setFont('helvetica', 'bold')
        doc.text('Task Evaluation', 40, data.settings.startY - 6)
      },
    })

    // Footer
    const footerY = Math.min(doc.internal.pageSize.getHeight() - 40, (doc as any).lastAutoTable?.finalY + 40 || 720)
    doc.setFont('helvetica', 'normal')
    doc.text('Instructor Signature: ____________________________   Student Acknowledgment: ____________________________', 40, footerY)

    doc.save(`mission-feedback-${header.student || 'student'}.pdf`)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="reporting" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AssessmentIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Mission Feedback Report</Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Student" value={header.student} onChange={(e) => setHeader({ ...header, student: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Mission #" value={header.missionNo} onChange={(e) => setHeader({ ...header, missionNo: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Mission Type" value={header.missionType} onChange={(e) => setHeader({ ...header, missionType: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Time" value={header.time} onChange={(e) => setHeader({ ...header, time: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Outcome" value={header.outcome} onChange={(e) => setHeader({ ...header, outcome: e.target.value })} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Instructor" value={header.instructor} onChange={(e) => setHeader({ ...header, instructor: e.target.value })} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth type="date" label="Date" value={header.date} onChange={(e) => setHeader({ ...header, date: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6} sm={3} md={2}><TextField fullWidth label="Score" value={header.score} onChange={(e) => setHeader({ ...header, score: e.target.value })} /></Grid>
                  <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Runway" value={header.runway} onChange={(e) => setHeader({ ...header, runway: e.target.value })} /></Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <TextField
                  label="Overall Remarks"
                  multiline
                  minRows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  fullWidth
                />
              </CardContent>
            </Card>
          </Grid>

          {Object.keys(grouped).map((cat) => (
            <Grid item xs={12} key={cat}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{cat}</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Tooltip title="Add Task"><span><IconButton color="primary" onClick={() => addTask(cat)}><AddCircleOutlineIcon /></IconButton></span></Tooltip>
                    <Tooltip title="Remove Last"><span><IconButton color="error" onClick={() => removeLastTaskIn(cat)}><RemoveCircleOutlineIcon /></IconButton></span></Tooltip>
                  </Stack>
                  <Grid container spacing={1}>
                    {grouped[cat].map((t) => (
                      <Grid item xs={12} key={t.id}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={12} md={4}><TextField fullWidth label="Item" value={t.title} onChange={(e) => handleTaskChange(t.id, 'title', e.target.value)} /></Grid>
                          <Grid item xs={4} md={2}><TextField fullWidth type="number" label="Min" value={t.min ?? ''} onChange={(e) => handleTaskChange(t.id, 'min', Number(e.target.value))} /></Grid>
                          <Grid item xs={4} md={2}>
                            <TextField fullWidth select label="Grade" value={t.grade} onChange={(e) => handleTaskChange(t.id, 'grade', e.target.value === '' ? '' : Number(e.target.value))}>
                              <MenuItem value="">None</MenuItem>
                              {[1, 2, 3, 4, 5].map((g) => (
                                <MenuItem key={g} value={g}>{g}</MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={4}><TextField fullWidth label="Comments" value={t.comments} onChange={(e) => handleTaskChange(t.id, 'comments', e.target.value)} /></Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={generatePdf}>Generate PDF</Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}



