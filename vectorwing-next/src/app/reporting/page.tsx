'use client'

import TopNav from '../../components/TopNav'
import { Box, Container, Grid, Card, CardContent, Typography, Stack, Chip, Button, TextField } from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'

export default function ReportingPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="reporting" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AssessmentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>KPI Dashboard (Mock)</Typography>
                </Stack>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6} md={3}><Stat title="Completion Rate" value="86%" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Stat title="Cancelations (wk)" value="12" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Stat title="Avg Hours / Student" value="41.2" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><Stat title="Aircraft Utilization" value="74%" /></Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}><Placeholder title="Student Progress Distribution" /></Grid>
                  <Grid item xs={12} md={6}><Placeholder title="Cancelation Causes" /></Grid>
                </Grid>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <TextField size="small" label="Custom report query" placeholder="e.g., Canceled flights last 30 days by reason" fullWidth />
                  <Button variant="outlined">Run</Button>
                  <Button variant="contained">Export CSV</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
      </CardContent>
    </Card>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <Card variant="outlined" sx={{ height: 260, display: 'grid', placeItems: 'center' }}>
      <Typography color="text.secondary">{title} (chart placeholder)</Typography>
    </Card>
  )
}


