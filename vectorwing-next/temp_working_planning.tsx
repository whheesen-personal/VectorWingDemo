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
import LabelIcon from '@mui/icons-material/Label'
import AddIcon from '@mui/icons-material/Add'
import ColorizeIcon from '@mui/icons-material/Colorize'
import TopNav from '../../components/TopNav'
import { useAppStore } from '../../state/store'

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
            <Legend />
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
        <Dialog open onClose={() => setSelectedItem(null)} maxWidth="sm" fullWidth>
          <DialogTitle>
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
                          {t.icon && <i className={`fa-solid ${t.icon}`} style={{ color: t.color }} />}
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
                <CreateTagButton onCreate={(tag) => selectedItem && handleAddTag(tag.id)} />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedItem(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ open: false, message: '' })} message={snack.message} />
    </div>
  )
}

function Legend() {
  const { availableTags } = useAppStore()
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--muted)' }}>Legend</Typography>
      <Stack spacing={1}>
        {availableTags.map((t) => (
          <Stack key={t.id} direction="row" spacing={1} alignItems="center">
            <span style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />
            <Typography variant="body2">{t.emoji ? `${t.emoji} ` : ''}{t.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

function TagPicker({ onPick }: { onPick: (tagId: string) => void }) {
  const { availableTags } = useAppStore()
  return (
    <Stack direction="row" spacing={0.5}>
      {availableTags.map((t) => (
        <Tooltip key={t.id} title={t.label}>
          <IconButton size="small" onClick={() => onPick(t.id)}>
            {t.icon ? <i className={`fa-solid ${t.icon}`} style={{ color: t.color }} /> : <LabelIcon sx={{ color: t.color }} fontSize="small" />}
          </IconButton>
        </Tooltip>
      ))}
      <CreateTagButton onCreate={() => {}} />
    </Stack>
  )
}

function CreateTagButton({ onCreate }: { onCreate: (tag: any) => void }) {
  const store = useAppStore()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#7c3aed')
  const [icon, setIcon] = useState('fa-star')
  const [emoji, setEmoji] = useState('')
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
            <TextField size="small" label="Font Awesome icon class (e.g., fa-plane, fa-flag)" value={icon} onChange={(e) => setIcon(e.target.value)} />
            <TextField size="small" label="Emoji (optional)" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (!label.trim()) return
            const tag = store.createTag(label.trim(), color, icon.trim() || undefined, emoji.trim() || undefined)
            onCreate(tag)
            setOpen(false)
            setLabel('')
            setEmoji('')
          }}>Create</Button>
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
  const tags = (it.tags || []).map((tid) => {
    const t = availableTags.find((x: any) => x.id === tid)
    if (!t) return ''
    const label = `${t.emoji || ''}`.trim()
    return `<span class="tag-pill" style="color:${t.color}">${label || '•'}</span>`
  }).join('')
  const safeTitle = escapeHtml(it.title)
  return `${tags}<span style="margin-left:6px">${safeTitle}</span>`
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


