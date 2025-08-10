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
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

const students = [
  { name: 'Lt Sam Lee', phase: 'Instruments', progress: 45, alerts: ['IFR check due in 14 days'] },
  { name: 'Lt Maria Gomez', phase: 'Contact', progress: 20, alerts: [] },
]

export default function TrainingPage() {
  const [view, setView] = React.useState<'progress' | 'syllabus'>('progress')
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
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Student Progress</Typography>
                  <ToggleButtonGroup exclusive size="small" value={view} onChange={(_e, v) => v && setView(v)} sx={{ ml: 'auto' }}>
                    <ToggleButton value="progress">Progress</ToggleButton>
                    <ToggleButton value="syllabus">Syllabus</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
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
                          <Stack direction="row" spacing={1}>
                            <Chip label={`Progress ${s.progress}%`} size="small" color="info" />
                            {s.alerts.map((a) => (
                              <Chip key={a} label={a} size="small" color="warning" variant="outlined" />
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
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
        </Grid>
      </Container>
    </Box>
  )
}


