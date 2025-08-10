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
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Drawer,
  Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'

type Crew = {
  id: string
  name: string
  role: 'Student' | 'Instructor'
  rank: string
  aircraft: string
  quals: string[]
  status: 'Available' | 'On Leave' | 'DNIF'
}

const data: Crew[] = [
  { id: '1', name: 'Capt Alex Hunter', role: 'Instructor', rank: 'O-3', aircraft: 'T-6', quals: ['IP', 'IFR'], status: 'Available' },
  { id: '2', name: 'Lt Sam Lee', role: 'Student', rank: 'O-2', aircraft: 'T-6', quals: ['Inst Phase'], status: 'Available' },
  { id: '3', name: 'Lt Maria Gomez', role: 'Student', rank: 'O-2', aircraft: 'T-6', quals: ['Contact'], status: 'On Leave' },
  { id: '4', name: 'Maj Chris Park', role: 'Instructor', rank: 'O-4', aircraft: 'T-6', quals: ['IP', 'Check Pilot'], status: 'Available' },
]

export default function CrewPage() {
  const [search, setSearch] = React.useState('')
  const [showStudents, setShowStudents] = React.useState(true)
  const [showInstructors, setShowInstructors] = React.useState(true)
  const [selected, setSelected] = React.useState<Crew | null>(null)

  const filtered = React.useMemo(() =>
    data.filter((d) =>
      (showStudents || d.role !== 'Student') &&
      (showInstructors || d.role !== 'Instructor') &&
      (search.trim() === '' || d.name.toLowerCase().includes(search.toLowerCase()))
    ),
  [search, showStudents, showInstructors])

  const instructors = filtered.filter((d) => d.role === 'Instructor').length
  const students = filtered.filter((d) => d.role === 'Student').length

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="crew" />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Roster</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={`Instructors ${instructors}`} color="info" variant="outlined" />
                  <Chip label={`Students ${students}`} color="success" variant="outlined" />
                </Stack>
                <TextField
                  fullWidth
                  placeholder="Search crew"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ mt: 2 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
                />
                <Divider sx={{ my: 2 }} />
                <FormControlLabel control={<Switch checked={showInstructors} onChange={(e) => setShowInstructors(e.target.checked)} />} label="Show instructors" />
                <FormControlLabel control={<Switch checked={showStudents} onChange={(e) => setShowStudents(e.target.checked)} />} label="Show students" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Crew List</Typography>
                  <Chip icon={<MilitaryTechIcon />} label="Qualified IPs 2" size="small" />
                </Stack>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Rank</TableCell>
                      <TableCell>Aircraft</TableCell>
                      <TableCell>Qualifications</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id} hover onClick={() => setSelected(c)} sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 28, height: 28 }}>{c.name.split(' ').at(-1)?.[0]}</Avatar>
                            <Typography>{c.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{c.role}</TableCell>
                        <TableCell>{c.rank}</TableCell>
                        <TableCell>{c.aircraft}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                            {c.quals.map((q) => (
                              <Chip key={q} label={q} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.status} size="small" color={c.status === 'Available' ? 'success' : c.status === 'On Leave' ? 'warning' : 'default'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
          <Box sx={{ width: 360, p: 2 }} role="presentation">
            {selected && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 40, height: 40 }}>{selected.name.split(' ').at(-1)?.[0]}</Avatar>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{selected.rank} · {selected.role}</Typography>
                  </div>
                </Stack>
                <Divider />
                <Typography variant="subtitle2">Qualifications</Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  {selected.quals.map((q) => (<Chip key={q} label={q} size="small" />))}
                </Stack>
                <Typography variant="subtitle2">Assigned Aircraft</Typography>
                <Chip label={selected.aircraft} size="small" color="info" variant="outlined" />
                <Typography variant="subtitle2">Actions</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" size="small">View schedule</Button>
                  <Button variant="outlined" size="small">Edit profile</Button>
                </Stack>
              </Stack>
            )}
          </Box>
        </Drawer>
      </Container>
    </Box>
  )
}


