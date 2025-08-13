'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
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
  Checkbox,
  TextFieldProps,
  Box,
  Tooltip,
} from '@mui/material'
import PublishIcon from '@mui/icons-material/Publish'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CancelIcon from '@mui/icons-material/Cancel'
import SearchIcon from '@mui/icons-material/Search'
import FlightIcon from '@mui/icons-material/Flight'
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard'
import TopNav from '../components/TopNav'
import TagTile from '../components/TagTile'
import { useAppStore } from '../state/store'
import { TagPicker as TagPickerComp, CreateTagButton as CreateTagButtonComp } from '../components/TagControls'

import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'

type Group = { id: string; content: string; order: number; type: 'aircraft' | 'sim' }
type Item = { id: string; group: string; start: Date; end: Date; title: string; content: string; status: 'Planned' | 'Authorized' | 'Canceled'; conflict?: boolean; notes?: string; tags?: string[] }

export default function HomePage() {
  const [view, setView] = useState<'day' | 'week'>('day')
  const [date, setDate] = useState(new Date())
  const [filters, setFilters] = useState({ showJets: true, showSims: true, search: '' })
  const store = useAppStore()
  const [items, setItems] = useState<Item[]>(store.missions as any)
  const [groups] = useState<Group[]>(store.groups as any)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [snack, setSnack] = useState({ open: false, message: '' })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timeline = useRef<Timeline | null>(null)
  const dsItems = useRef<DataSet<Item> | null>(null)
  const dsGroups = useRef<DataSet<Group> | null>(null)

  // Function to render item content as HTML string (simple approach like before)
  const renderContent = useCallback((it: Item, availableTags: any[]) => {
    const tags = (it.tags || []).map((tid) => {
      const t = availableTags.find((x: any) => x.id === tid)
      if (!t) return ''
      const iconPath = t.icon || ''
      if (iconPath && iconPath.startsWith('/assets/')) {
        return `<span class="tag-pill" style="color:${t.color}"><img src="${iconPath}" width="12" height="12" style="filter: brightness(0) saturate(100%) invert(1);" /></span>`
      }
      const symbol = t.symbol || t.emoji || '•'
      return `<span class="tag-pill" style="color:${t.color}">${symbol}</span>`
    }).join('')
    
    const safeTitle = escapeHtml(it.title)
    return `${tags}<span style="margin-left:6px;font-weight:700;color:white">${safeTitle}</span>`
  }, [])

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
    
    // Prepare items with content BEFORE adding to timeline
    const itemsWithContent = visibleItems.map((it) => ({
      ...it,
      content: renderContent(it, store.availableTags as any),
      className: `status-${it.status}${it.conflict ? ' conflict' : ''}`,
      title: buildHoverTitle(it, store.availableTags as any),
    }))
    
    dsItems.current = new DataSet(itemsWithContent as any)
    // Active schedule is read-only for layout changes. No move/resize handlers.
    timeline.current = new Timeline(
      containerRef.current,
      dsItems.current as any,
      dsGroups.current as any,
      { 
        ...buildVisOptions(view, date), 
        editable: { add: false, remove: false, updateTime: false, updateGroup: false }
      } as any
    )
    timeline.current.on('doubleClick', (props: any) => {
      if (props.item && dsItems.current) setSelectedItem(dsItems.current.get(props.item as string) as Item)
    })
    timeline.current.on('rangechanged', (ev: any) => setDate(new Date(ev.start)))
  }, [groups, visibleItems, view, date, renderContent, buildHoverTitle])

  useEffect(() => {
    if (!timeline.current || !dsItems.current || !dsGroups.current) return
    dsGroups.current.update(groups as any)
    
    // Clear and re-add items with updated content
    dsItems.current.clear()
    const itemsWithContent = visibleItems.map((it) => ({
      ...it,
      content: renderContent(it, store.availableTags as any),
      className: `status-${it.status}${it.conflict ? ' conflict' : ''}`,
      title: buildHoverTitle(it, store.availableTags as any),
    }))
    dsItems.current.add(itemsWithContent as any)
    
    timeline.current.setOptions(buildVisOptions(view, date))
  }, [groups, visibleItems, view, date, store.availableTags, renderContent, buildHoverTitle])

  function handleAuthorize(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Authorized' } : p)))
    store.updateMissionStatus(id, 'Authorized')
    setSelectedItem(null)
    setSnack({ open: true, message: 'Mission authorized' })
  }
  function handleCancel(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Canceled' } : p)))
    store.updateMissionStatus(id, 'Canceled')
    setSelectedItem(null)
    setSnack({ open: true, message: 'Mission canceled' })
  }
  function handleAddTag(tagId: string) {
    if (!selectedItem) return
    store.addTagToMission(selectedItem.id, tagId)
    setItems((prev) => prev.map((m) => (m.id === selectedItem.id ? { ...m, tags: Array.from(new Set([...(m.tags || []), tagId])) } : m)))
    setSelectedItem((prev) => (prev ? { ...prev, tags: Array.from(new Set([...(prev.tags || []), tagId])) } : prev))
  }
  function handleRemoveTag(tagId: string) {
    if (!selectedItem) return
    store.removeTagFromMission(selectedItem.id, tagId)
    setItems((prev) => prev.map((m) => (m.id === selectedItem.id ? { ...m, tags: (m.tags || []).filter((t) => t !== tagId) } : m)))
    setSelectedItem((prev) => (prev ? { ...prev, tags: (prev.tags || []).filter((t) => t !== tagId) } : prev))
  }

  const counts = useMemo(() => ({
    planned: visibleItems.filter((i) => i.status === 'Planned').length,
    auth: visibleItems.filter((i) => i.status === 'Authorized').length,
    canceled: visibleItems.filter((i) => i.status === 'Canceled').length,
  }), [visibleItems])

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh' }}>
      <TopNav active="schedule" />
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
              <FormControlLabel control={<Switch checked={filters.showJets} onChange={(e) => setFilters((f) => ({ ...f, showJets: e.target.checked }))} />} label={<Stack direction="row" spacing={1} alignItems="center"><FlightIcon fontSize="small" /> <span>Show Aircraft</span></Stack>} />
              <FormControlLabel control={<Switch checked={filters.showSims} onChange={(e) => setFilters((f) => ({ ...f, showSims: e.target.checked }))} />} label={<Stack direction="row" spacing={1} alignItems="center"><DeveloperBoardIcon fontSize="small" /> <span>Show Simulators</span></Stack>} />
            </FormGroup>
            <Divider />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--muted)' }}>Date Range</Typography>
            <ToggleButtonGroup exclusive value={view} onChange={(_e, v) => v && setView(v)}>
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
            </ToggleButtonGroup>
            <Alert severity="info" variant="outlined">Double‑click a mission for details</Alert>
            <Divider />
            <Stack direction="row" spacing={1}>
              <Chip label={`Planned ${counts.planned}`} color="info" variant="outlined" size="small" />
              <Chip label={`Authorized ${counts.auth}`} color="success" variant="outlined" size="small" />
              <Chip label={`Canceled ${counts.canceled}`} color="warning" variant="outlined" size="small" />
            </Stack>
          </Stack>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--panel-2)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #243049', position: 'sticky', top: 0, zIndex: 2, background: 'var(--panel-2)' }}>
            <Button variant="contained" startIcon={<PublishIcon />} onClick={() => setSnack({ open: true, message: 'Day published (demo)' })} sx={{ fontWeight: 700 }}>Publish Day</Button>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={() => setSnack({ open: true, message: 'Exported PDF (demo)' })} sx={{ fontWeight: 700 }}>Export PDF</Button>
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
            Mission {selectedItem.title}
            {selectedItem.status === 'Authorized' && <span style={{ marginLeft: 8, background: '#22c55e', color: '#05100a', padding: '2px 6px', borderRadius: 999, fontSize: 12 }}>Authorized</span>}
            {selectedItem.status === 'Canceled' && <span style={{ marginLeft: 8, background: '#f59e0b', color: '#110a04', padding: '2px 6px', borderRadius: 999, fontSize: 12 }}>Canceled</span>}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Resource: {groupName(groups, selectedItem.group)}</Typography>
              <Typography variant="body2" color="text.secondary">Start: {new Date(selectedItem.start).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">End: {new Date(selectedItem.end).toLocaleString()}</Typography>
              <TextField label="Notes" multiline minRows={3} defaultValue={selectedItem.notes || ''} fullWidth />
              <Typography variant="subtitle2">Tags</Typography>
              <FormGroup>
                {store.availableTags.map((t) => {
                  const checked = (selectedItem.tags || []).includes(t.id)
                  return (
                    <FormControlLabel
                      key={t.id}
                      control={<Checkbox checked={checked} onChange={(e) => e.target.checked ? handleAddTag(t.id) : handleRemoveTag(t.id)} />}
                      label={
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {t.icon && t.icon.startsWith('/assets/') ? (
                            <img src={t.icon} alt={t.label} style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(1)' }} />
                          ) : (
                            <i className={`fa-solid ${t.icon || 'fa-tag'}`} style={{ color: t.color }} />
                          )}
                          <span>{t.label}</span>
                        </span>
                      }
                    />
                  )
                })}
              </FormGroup>
            </Stack>
          </DialogContent>
          <DialogActions>
            {selectedItem.status !== 'Authorized' && <Button startIcon={<VerifiedUserIcon />} variant="contained" onClick={() => handleAuthorize(selectedItem.id)} sx={{ fontWeight: 700 }}>Authorize</Button>}
            {selectedItem.status !== 'Canceled' && <Button color="error" startIcon={<CancelIcon />} onClick={() => handleCancel(selectedItem.id)} sx={{ fontWeight: 700 }}>Cancel Mission</Button>}
            <Button onClick={() => setSelectedItem(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ open: false, message: '' })} message={snack.message} />
    </div>
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

function renderReactContent(node: React.ReactNode) {
  const { renderToStaticMarkup } = require('react-dom/server')
  return renderToStaticMarkup(node as any)
}

function buildHoverTitle(it: Item, availableTags: any[]) {
  const names = (it.tags || [])
    .map((tid) => availableTags.find((t: any) => t.id === tid)?.label)
    .filter(Boolean)
  return names.length ? `Tags: ${names.join(', ')}` : it.title
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function demoGroups(): Group[] {
  return [
    { id: 'AC-101', content: 'Aircraft 101', order: 1, type: 'aircraft' },
    { id: 'AC-202', content: 'Aircraft 202', order: 2, type: 'aircraft' },
    { id: 'SIM-A', content: 'Simulator A', order: 3, type: 'sim' },
    { id: 'SIM-B', content: 'Simulator B', order: 4, type: 'sim' },
  ]
}

function demoItems(baseDate: Date): Item[] {
  const d = (h: number, m: number) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), h, m, 0, 0)
  const items: Item[] = [
    { id: 'M1', group: 'AC-101', start: d(8, 0), end: d(10, 0), title: 'Instrument 1', content: 'Instrument 1', status: 'Planned' },
    { id: 'M2', group: 'AC-101', start: d(10, 30), end: d(12, 0), title: 'Formation 1', content: 'Formation 1', status: 'Planned' },
    { id: 'M3', group: 'AC-202', start: d(9, 0), end: d(11, 30), title: 'Nav 2', content: 'Nav 2', status: 'Planned' },
    { id: 'M4', group: 'SIM-A', start: d(13, 0), end: d(14, 30), title: 'Sim Check', content: 'Sim Check', status: 'Authorized' },
    { id: 'M5', group: 'SIM-B', start: d(9, 30), end: d(11, 0), title: 'Basic Instruments', content: 'Basic Instruments', status: 'Planned' },
    { id: 'M6', group: 'AC-202', start: d(12, 0), end: d(13, 0), title: 'Pattern', content: 'Pattern', status: 'Canceled' },
  ]
  return markConflicts(items)
}


