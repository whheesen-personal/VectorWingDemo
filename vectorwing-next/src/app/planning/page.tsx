'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Typography,
  Chip,
  Stack,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PublishIcon from '@mui/icons-material/Publish'
import SearchIcon from '@mui/icons-material/Search'


import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TopNav from '../../components/TopNav'
import { useAppStore } from '../../state/store'
import IconUpload from '../../components/IconUpload'
import { CreateTagDialog } from '../../components/CreateTagDialog'

import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'

type Group = { id: string; content: string; order: number; type: 'aircraft' | 'sim' }
type Item = { id: string; group: string; start: Date; end: Date; title: string; content: string; status: 'Planned' | 'Authorized' | 'Canceled'; conflict?: boolean; notes?: string; tags?: string[] }

export default function PlanningPage() {
  const [view, setView] = useState<'day' | 'week'>('day')
  const [date, setDate] = useState(new Date())
  const [filters, setFilters] = useState({ showJets: true, showSims: true, search: '' })
  const store = useAppStore()
  const [items, setItems] = useState<Item[]>(store.planningMissions as any)
  const [groups] = useState<Group[]>(store.groups as any)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [snack, setSnack] = useState({ open: false, message: '' })
  const [iconUploadOpen, setIconUploadOpen] = useState(false)
  const [createTagOpen, setCreateTagOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timeline = useRef<Timeline | null>(null)
  const dsItems = useRef<DataSet<Item> | null>(null)
  const dsGroups = useRef<DataSet<Group> | null>(null)

  const visibleItems = useMemo(() => {
    return items.filter((it) => {
      const g = groups.find((g) => g.id === it.group)
      if (!g) return false
      if (g.type === 'aircraft' && !filters.showJets) return false
      if (g.type === 'sim' && !filters.showSims) return false
      if (filters.search && !it.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [items, groups, filters])

  useEffect(() => {
    if (!containerRef.current || timeline.current) return
    dsGroups.current = new DataSet(groups as any)
    dsItems.current = new DataSet(visibleItems as any)
    timeline.current = new Timeline(containerRef.current, dsItems.current as any, dsGroups.current as any, buildVisOptions(view, date))
    timeline.current.on('doubleClick', (props: any) => {
      if (props.item && dsItems.current) setSelectedItem(dsItems.current.get(props.item as string) as Item)
    })
    timeline.current.on('itemmoved', (ev: any) => {
      const newGroup = ev?.data?.group || ev?.group
      const updated = markConflicts(items.map((p) => (p.id === ev.item ? { ...p, start: ev.start, end: ev.end, group: newGroup || p.group } : p)))
      setItems(updated)
      store.updatePlanningMissionWindow(ev.item as string, ev.start, ev.end)
      if (newGroup) store.updatePlanningMissionGroup(ev.item as string, newGroup)
    })
    timeline.current.on('itemresized', (ev: any) => {
      const updated = markConflicts(items.map((p) => (p.id === ev.item ? { ...p, start: ev.start, end: ev.end } : p)))
      setItems(updated)
      store.updatePlanningMissionWindow(ev.item as string, ev.start, ev.end)
    })
    timeline.current.on('rangechanged', (ev: any) => setDate(new Date(ev.start)))
  }, [groups, visibleItems, view, date, items, store])

  useEffect(() => {
    if (!timeline.current || !dsItems.current || !dsGroups.current) return
    dsGroups.current.update(groups as any)
    dsItems.current.clear()
    dsItems.current.add(
      visibleItems.map((it) => ({
        ...it,
        className: `status-${it.status}${it.conflict ? ' conflict' : ''}`,
        content: renderContent(it, store.availableTags as any),
        title: buildHoverTitle(it, store.availableTags as any),
      })) as any
    )
    timeline.current.setOptions(buildVisOptions(view, date))
  }, [groups, visibleItems, view, date])

  function handleAddTag(tagId: string) {
    if (!selectedItem) return
    store.addTagToPlanningMission(selectedItem.id, tagId)
    setItems((prev) => prev.map((m) => (m.id === selectedItem.id ? { ...m, tags: Array.from(new Set([...(m.tags || []), tagId])) } : m)))
  }
  function handleRemoveTag(tagId: string) {
    if (!selectedItem) return
    store.removeTagFromPlanningMission(selectedItem.id, tagId)
    setItems((prev) => prev.map((m) => (m.id === selectedItem.id ? { ...m, tags: (m.tags || []).filter((t) => t !== tagId) } : m)))
  }

  function handlePublishDay() {
    store.publishPlanningToActive()
    setSnack({ open: true, message: 'Planning published to Active' })
  }

  function handleIconUpload(file: File, label: string) {
    // In a real app, this would upload to a server
    // For now, we'll create a data URL and add it as a new tag
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const color = '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
      const tag = store.createTag(label, color, dataUrl, undefined)
      setSnack({ open: true, message: `Icon "${label}" uploaded successfully` })
    }
    reader.readAsDataURL(file)
  }

  function handleCreateTag(label: string, color: string, iconPath?: string) {
    const tag = store.createTag(label, color, iconPath, undefined)
    setSnack({ open: true, message: `Tag "${label}" created successfully` })
    return tag
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh' }}>
      <TopNav active="planning" />
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr' }}>
        <div style={{ padding: 16, borderRight: '1px solid #243049', background: 'var(--panel)' }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--muted)' }}>Filters</Typography>
            <TextField
              placeholder="Search missions..."
              size="small"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
            />
            <FormGroup>
              <FormControlLabel control={<Switch checked={filters.showJets} onChange={(e) => setFilters((f) => ({ ...f, showJets: e.target.checked }))} />} label={<Stack direction="row" spacing={1} alignItems="center"><span>Show Aircraft</span></Stack>} />
              <FormControlLabel control={<Switch checked={filters.showSims} onChange={(e) => setFilters((f) => ({ ...f, showSims: e.target.checked }))} />} label={<Stack direction="row" spacing={1} alignItems="center"><span>Show Simulators</span></Stack>} />
            </FormGroup>
            <Divider />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--muted)' }}>Date Range</Typography>
            <ToggleButtonGroup exclusive value={view} onChange={(_e, v) => v && setView(v)}>
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
            </ToggleButtonGroup>
            <Alert severity="info" variant="outlined">Drag missions to plan; add tags for context</Alert>
            <Divider />
            <Legend 
              onUploadIcon={() => setIconUploadOpen(true)} 
              onCreateTag={() => setCreateTagOpen(true)}
            />
          </Stack>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--panel-2)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #243049', position: 'sticky', top: 0, zIndex: 2, background: 'var(--panel-2)' }}>
            <Button variant="contained" startIcon={<PublishIcon />} onClick={handlePublishDay} sx={{ fontWeight: 700 }}>Publish to Active</Button>
            <div style={{ flex: 1 }} />
            <Chip variant="outlined" label={labelForDate(date, view)} icon={<CalendarMonthIcon />} sx={{ fontWeight: 700 }} />
          </div>
          <div style={{ flex: 1, padding: 8 }}>
            <div ref={containerRef} style={{ height: '100%', minHeight: 400 }} />
          </div>
        </div>
      </div>

      {selectedItem && (
        <Dialog 
          open 
          onClose={() => setSelectedItem(null)} 
          maxWidth="sm" 
          fullWidth
          aria-labelledby="mission-dialog-title"
          disablePortal={false}
          keepMounted={false}
        >
          <DialogTitle id="mission-dialog-title">
            Plan Mission {selectedItem.title}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Resource: {groupName(groups, selectedItem.group)}</Typography>
              <Typography variant="body2" color="text.secondary">Start: {new Date(selectedItem.start).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">End: {new Date(selectedItem.end).toLocaleString()}</Typography>
              <TextField label="Notes" multiline minRows={3} defaultValue={selectedItem.notes || ''} fullWidth />
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Tags</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {(selectedItem.tags || []).map((tid) => {
                  const t = store.availableTags.find((x) => x.id === tid)
                  if (!t) return null
                  return (
                    <Chip
                      key={tid}
                      label={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          {t.icon && t.icon.startsWith('/assets/') ? (
                            <img src={t.icon} alt={t.label} style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(1)' }} />
                          ) : (
                            <i className={`fa-solid ${t.icon || 'fa-tag'}`} style={{ color: t.color }} />
                          )}
                          <span>{`${t.emoji || ''} ${t.label}`.trim()}</span>
                        </span>
                      }
                      onDelete={() => handleRemoveTag(tid)}
                      size="small"
                      sx={{ background: `${t.color}22`, border: `1px solid ${t.color}`, color: t.color }}
                    />
                  )
                })}
                <TagPicker onPick={handleAddTag} />
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setCreateTagOpen(true)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Create Tag
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedItem(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ open: false, message: '' })} message={snack.message} />
      
      <IconUpload 
        open={iconUploadOpen} 
        onClose={() => setIconUploadOpen(false)} 
        onUpload={handleIconUpload} 
      />
      
      <CreateTagDialog
        open={createTagOpen}
        onClose={() => setCreateTagOpen(false)}
        onCreateTag={handleCreateTag}
        useIconLibrary={true}
      />
    </div>
  )
}

function Legend({ onUploadIcon, onCreateTag }: { onUploadIcon: () => void; onCreateTag: () => void }) {
  const store = useAppStore()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ label: string; color: string; icon: string; emoji: string }>({ label: '', color: '#7c3aed', icon: 'fa-plane', emoji: '' })

  const startEdit = (id: string) => {
    const t = store.availableTags.find((x) => x.id === id)
    if (!t) return
    setEditing(id)
    setDraft({ label: t.label, color: t.color, icon: t.icon || 'fa-plane', emoji: t.emoji || '' })
  }
  const save = () => {
    if (!editing) return
    store.updateTag(editing, { label: draft.label, color: draft.color, icon: draft.icon, emoji: draft.emoji })
    setEditing(null)
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--muted)' }}>Tags</Typography>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onUploadIcon}
          sx={{ fontSize: '0.75rem' }}
        >
          Upload Icon
        </Button>
      </Stack>
      <Stack spacing={1}>
        {store.availableTags.map((t) => (
          <Stack key={t.id} direction="row" spacing={1} alignItems="center">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <Typography variant="body2">{t.label}</Typography>
            </span>
            <Tooltip title="Edit"><IconButton size="small" onClick={() => startEdit(t.id)}><EditIcon fontSize="inherit" /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton size="small" onClick={() => store.deleteTag(t.id)}><DeleteIcon fontSize="inherit" /></IconButton></Tooltip>
          </Stack>
        ))}
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onCreateTag}
          sx={{ fontSize: '0.75rem' }}
        >
          Create Tag
        </Button>
      </Stack>

      <Dialog 
        open={!!editing} 
        onClose={() => setEditing(null)} 
        maxWidth="xs" 
        fullWidth
        aria-labelledby="edit-tag-dialog-title"
        disablePortal={false}
        keepMounted={false}
      >
        <DialogTitle id="edit-tag-dialog-title">Edit Tag</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="Label" value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} autoFocus />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 40 }}>Color:</Typography>
              <TextField size="small" label="Color" type="color" value={draft.color} onChange={(e) => setDraft((d) => ({ ...d, color: (e.target as any).value }))} sx={{ width: 120 }} />
            </Stack>
            <TextField size="small" label="Font Awesome class" value={draft.icon} onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))} />
            <TextField size="small" label="Emoji" value={draft.emoji} onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

function TagPicker({ onPick }: { onPick: (tagId: string) => void }) {
  const store = useAppStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = store.availableTags.filter((t) => 
    t.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Add Tag
      </Button>
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="xs" 
        fullWidth
        aria-labelledby="add-tag-dialog-title"
        disablePortal={false}
        keepMounted={false}
      >
        <DialogTitle id="add-tag-dialog-title">Add Tag</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField
              size="small"
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <Stack spacing={1}>
              {filtered.map((t) => (
                <Button
                  key={t.id}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    onPick(t.id)
                    setOpen(false)
                  }}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>{t.label}</span>
                  </span>
                </Button>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function buildVisOptions(view: 'day' | 'week', date: Date) {
  const start = new Date(date)
  const end = new Date(date)
  if (view === 'day') {
    start.setHours(6, 0, 0, 0)
    end.setHours(22, 0, 0, 0)
  } else {
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    start.setHours(6, 0, 0, 0)
    end.setTime(start.getTime() + 6 * 24 * 60 * 60 * 1000)
    end.setHours(22, 0, 0, 0)
  }
  return {
    stack: false,
    editable: { add: false, remove: false, updateTime: true, updateGroup: true },
    margin: { item: 8 },
    orientation: 'top',
    zoomMin: 15 * 60 * 1000,
    zoomMax: 14 * 24 * 60 * 60 * 1000,
    start,
    end,
    multiselect: false,
    clickToUse: false,
    selectable: true,
    groupOrder: (a: any, b: any) => a.order - b.order,
    tooltip: { followMouse: true },
    moveable: true,
    timeAxis: { scale: 'hour', step: 1 },
    locale: 'en',
  } as any
}

function groupName(groups: Group[], id: string) {
  const g = groups.find((x) => x.id === id)
  return g ? g.content : id
}

function labelForDate(date: Date, view: 'day' | 'week') {
  if (view === 'day') return new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date)
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)
  start.setHours(6, 0, 0, 0)
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })
  return `${fmt.format(start)} - ${fmt.format(end)}`
}

function overlaps(a: Item, b: Item) {
  return a.group === b.group && a.id !== b.id && a.start < b.end && b.start < a.end
}

function markConflicts(items: Item[]) {
  return items.map((it) => ({ ...it, conflict: items.some((other) => overlaps(it, other)) }))
}

function renderContent(it: Item, availableTags: any[]) {
  const safeTitle = escapeHtml(it.title)
  return `<span style="font-weight:700;color:white">${safeTitle}</span>`
}

function buildHoverTitle(it: Item, availableTags: any[]) {
  return it.title
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}


