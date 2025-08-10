'use client'

import TopNav from '../../components/TopNav'
import { Box, Container, Grid, Card, CardContent, Typography, Stack, Button, TextField } from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { KpiStatCard, KpiTrendCard, ProgressDistributionCard, CancelReasonsCard } from '../../components/KpiCharts'

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
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>KPI Dashboard</Typography>
                </Stack>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6} md={3}><KpiStatCard title="Completion Rate" value="86%" delta="+3%" deltaLabel="vs last wk" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><KpiStatCard title="Cancelations (wk)" value="12" delta="-2" deltaLabel="vs last wk" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><KpiStatCard title="Avg Hours / Student" value="41.2" delta="+0.6" deltaLabel="hrs" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><KpiStatCard title="Aircraft Utilization" value="74%" delta="+2%" /></Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}><KpiTrendCard /></Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}><ProgressDistributionCard /></Grid>
                  <Grid item xs={12} md={6}><CancelReasonsCard /></Grid>
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

