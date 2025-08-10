'use client'

import TopNav from '../../components/TopNav'
import { Box, Container, Grid, Card, CardContent, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody, Switch, FormControlLabel, Divider } from '@mui/material'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'

const aircraft = [
  { tail: 'AC-101', status: 'Available', notes: 'Preferred for Instruments' },
  { tail: 'AC-202', status: 'Down for maintenance', notes: 'Phase inspection' },
]

const sims = [
  { name: 'SIM-A', status: 'Available', notes: 'Bay 1' },
  { name: 'SIM-B', status: 'Available', notes: 'Bay 2' },
]

export default function ResourcesPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="resources" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PrecisionManufacturingIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Resource Status</Typography>
                </Stack>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Aircraft</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow><TableCell>Tail</TableCell><TableCell>Status</TableCell><TableCell>Notes</TableCell></TableRow>
                      </TableHead>
                      <TableBody>
                        {aircraft.map((a) => (
                          <TableRow key={a.tail} hover>
                            <TableCell>{a.tail}</TableCell>
                            <TableCell><Chip label={a.status} size="small" color={a.status === 'Available' ? 'success' : 'warning'} /></TableCell>
                            <TableCell>{a.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Simulators</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow><TableCell>Simulator</TableCell><TableCell>Status</TableCell><TableCell>Notes</TableCell></TableRow>
                      </TableHead>
                      <TableBody>
                        {sims.map((s) => (
                          <TableRow key={s.name} hover>
                            <TableCell>{s.name}</TableCell>
                            <TableCell><Chip label={s.status} size="small" color={s.status === 'Available' ? 'success' : 'warning'} /></TableCell>
                            <TableCell>{s.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Options</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Push live status updates" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}


