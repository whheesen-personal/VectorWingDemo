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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CancelIcon from '@mui/icons-material/Cancel'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

type Pending = { id: string; title: string; crew: string; time: string; risk: 'Low' | 'Medium' | 'High' }

const pending: Pending[] = [
  { id: 'M2', title: 'Formation 1', crew: 'Capt Hunter / Lt Lee', time: '10:30-12:00', risk: 'Medium' },
  { id: 'M3', title: 'Nav 2', crew: 'Maj Park / Lt Gomez', time: '09:00-11:30', risk: 'Low' },
]

export default function AuthorizationPage() {
  const [open, setOpen] = React.useState<Pending | null>(null)

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="authorization" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FingerprintIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Pending Authorizations</Typography>
                  <Chip label={`${pending.length} awaiting action`} size="small" />
                  <Chip icon={<CalendarMonthIcon />} label={new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date())} variant="outlined" sx={{ ml: 'auto' }} />
                </Stack>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {pending.map((p) => (
                    <Stack key={p.id} direction="row" spacing={2} alignItems="center" sx={{ p: 1.5, border: '1px solid #243049', borderRadius: 1 }}>
                      <Typography sx={{ minWidth: 160, fontWeight: 700 }}>{p.title}</Typography>
                      <Typography color="text.secondary">{p.crew}</Typography>
                      <Typography color="text.secondary" sx={{ flex: 1 }}>{p.time}</Typography>
                      <Chip label={`Risk ${p.risk}`} color={p.risk === 'High' ? 'warning' : 'default'} variant="outlined" />
                      <Button startIcon={<VerifiedUserIcon />} variant="contained" onClick={() => setOpen(p)}>Authorize</Button>
                      <Button startIcon={<CancelIcon />} color="error">Deny</Button>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {open && (
        <Dialog open onClose={() => setOpen(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Biometric Verification</DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              <Typography>Place finger on approved scanner to authorize mission <b>{open.title}</b>.</Typography>
              <Typography variant="body2" color="text.secondary">(Demo only – this simulates WebAuthn/biometric flow.)</Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button startIcon={<VerifiedUserIcon />} variant="contained" onClick={() => setOpen(null)}>Simulate Success</Button>
            <Button onClick={() => setOpen(null)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}


