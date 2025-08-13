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
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CancelIcon from '@mui/icons-material/Cancel'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupIcon from '@mui/icons-material/Group'

type Pending = { id: string; title: string; crew: string; time: string; risk: 'Low' | 'Medium' | 'High' }

const pending: Pending[] = [
  { id: 'M1', title: 'Night Training', crew: 'Capt Smith / Lt Johnson', time: '20:00-22:30', risk: 'High' },
  { id: 'M2', title: 'Formation 1', crew: 'Capt Hunter / Lt Lee', time: '10:30-12:00', risk: 'Medium' },
  { id: 'M3', title: 'Nav 2', crew: 'Maj Park / Lt Gomez', time: '09:00-11:30', risk: 'Low' },
  { id: 'M4', title: 'Simulator Check', crew: 'Lt Davis / Lt Wilson', time: '14:00-16:00', risk: 'Low' },
  { id: 'M5', title: 'High Altitude', crew: 'Maj Thompson / Capt Brown', time: '13:00-15:30', risk: 'Medium' },
  { id: 'M6', title: 'Weather Training', crew: 'Lt Garcia / Lt Martinez', time: '08:00-10:00', risk: 'Low' },
  { id: 'M7', title: 'Emergency Procedures', crew: 'Capt Anderson / Lt Taylor', time: '16:00-18:00', risk: 'High' },
]

export default function AuthorizationPage() {
  const [open, setOpen] = React.useState<Pending | null>(null)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [groupAuthOpen, setGroupAuthOpen] = React.useState(false)

  const handleSelectAll = () => {
    if (selectedItems.size === pending.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(pending.map(p => p.id)))
    }
  }

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleGroupAuthorize = () => {
    setGroupAuthOpen(true)
  }

  const handleGroupAuthConfirm = () => {
    // Here you would implement the actual group authorization logic
    console.log('Group authorizing:', Array.from(selectedItems))
    setGroupAuthOpen(false)
    setSelectedItems(new Set())
  }

  const selectedCount = selectedItems.size

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
                
                {/* Group Authorization Controls */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedItems.size === pending.length}
                        indeterminate={selectedItems.size > 0 && selectedItems.size < pending.length}
                        onChange={handleSelectAll}
                      />
                    }
                    label="Select All"
                  />
                  {selectedCount > 0 && (
                    <>
                      <Chip label={`${selectedCount} selected`} color="primary" size="small" />
                      <Button
                        startIcon={<GroupIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleGroupAuthorize}
                        disabled={selectedCount === 0}
                      >
                        Authorize Group ({selectedCount})
                      </Button>
                    </>
                  )}
                </Stack>
                
                <Divider sx={{ my: 1 }} />
                
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {pending.map((p) => (
                    <Stack key={p.id} direction="row" spacing={2} alignItems="center" sx={{ p: 1.5, border: '1px solid #243049', borderRadius: 1 }}>
                      <Checkbox
                        checked={selectedItems.has(p.id)}
                        onChange={() => handleSelectItem(p.id)}
                      />
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

      {/* Individual Authorization Dialog */}
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

      {/* Group Authorization Dialog */}
      <Dialog open={groupAuthOpen} onClose={() => setGroupAuthOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Group Authorization</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              You are about to authorize <b>{selectedCount} mission(s)</b>:
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {pending
                .filter(p => selectedItems.has(p.id))
                .map(p => (
                  <Typography key={p.id} variant="body2" sx={{ py: 0.5 }}>
                    • {p.title} - {p.crew} ({p.time})
                  </Typography>
                ))
              }
            </Box>
            <Typography variant="body2" color="text.secondary">
              Place finger on approved scanner to authorize all selected missions.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<GroupIcon />} variant="contained" onClick={handleGroupAuthConfirm}>Authorize All</Button>
          <Button onClick={() => setGroupAuthOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


