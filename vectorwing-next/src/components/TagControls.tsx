'use client'

import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ColorizeIcon from '@mui/icons-material/Colorize'
import { useAppStore } from '../state/store'

export function TagPicker({ onPick }: { onPick: (tagId: string) => void }) {
  const { availableTags } = useAppStore()
  return (
    <Stack direction="row" spacing={0.5}>
      {availableTags.map((t) => (
        <Tooltip key={t.id} title={t.label}>
          <IconButton size="small" onClick={() => onPick(t.id)}>
            {t.icon ? <i className={`fa-solid ${t.icon}`} style={{ color: t.color }} /> : <i className="fa-solid fa-tag" style={{ color: t.color }} />}
          </IconButton>
        </Tooltip>
      ))}
      <CreateTagButton onCreate={() => {}} />
    </Stack>
  )
}

const ICON_SET = [
  'fa-plane',
  'fa-plane-departure',
  'fa-plane-arrival',
  'fa-bullseye',
  'fa-shield-halved',
  'fa-triangle-exclamation',
  'fa-clock',
  'fa-moon',
  'fa-sun',
  'fa-cloud',
  'fa-wind',
  'fa-screwdriver-wrench',
  'fa-toolbox',
  'fa-route',
  'fa-radar',
  'fa-headset',
  'fa-flag-checkered',
]

export function CreateTagButton({ onCreate }: { onCreate: (tag: any) => void }) {
  const store = useAppStore()
  const [open, setOpen] = React.useState(false)
  const [label, setLabel] = React.useState('')
  const [color, setColor] = React.useState('#7c3aed')
  const [icon, setIcon] = React.useState<string>('fa-plane')

  const create = () => {
    if (!label.trim()) return
    const tag = store.createTag(label.trim(), color, icon || undefined, undefined)
    onCreate(tag)
    setOpen(false)
    setLabel('')
  }

  return (
    <>
      <Tooltip title="Create tag"><IconButton size="small" onClick={() => setOpen(true)}><AddIcon fontSize="small" /></IconButton></Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create Tag</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="Label" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
            <Stack direction="row" spacing={1} alignItems="center">
              <ColorizeIcon fontSize="small" />
              <TextField size="small" label="Color" type="color" value={color} onChange={(e) => setColor((e.target as any).value)} sx={{ width: 120 }} />
              <Box sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <i className={`fa-solid ${icon}`} style={{ color }} />
              </Box>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.5 }}>
              {ICON_SET.map((ic) => (
                <IconButton key={ic} size="small" onClick={() => setIcon(ic)} sx={{ border: icon === ic ? '2px solid #60a5fa' : '1px solid #243049' }}>
                  <i className={`fa-solid ${ic}`} style={{ color }} />
                </IconButton>
              ))}
            </Box>
            <TextField size="small" label="Font Awesome class (advanced)" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="fa-plane, fa-flag" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={create}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default { TagPicker, CreateTagButton }


