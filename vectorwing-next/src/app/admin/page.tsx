'use client'

import TopNav from '../../components/TopNav'
import { Box, Container, Grid, Card, CardContent, Typography, Stack, Switch, FormControlLabel, Divider, TextField, Button } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

export default function AdminPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="admin" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SettingsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>System Settings (Mock)</Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Security</Typography>
                    <FormControlLabel control={<Switch defaultChecked />} label="Require MFA for admin" />
                    <FormControlLabel control={<Switch />} label="Enable CAC login" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Scheduling Rules</Typography>
                    <TextField label="Max daily flight hours" defaultValue={8} size="small" sx={{ mr: 2 }} />
                    <TextField label="Min aircraft turnaround (min)" defaultValue={60} size="small" />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  <Button variant="contained">Save settings</Button>
                  <Button variant="outlined">Export config</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}


