'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export type Group = { id: string; content: string; order: number; type: 'aircraft' | 'sim' }
export type MissionStatus = 'Planned' | 'Authorized' | 'Canceled'
export type MissionTag = {
  id: string
  label: string
  color: string
  icon?: string
  emoji?: string
  symbol?: string
}

export type MissionItem = {
  id: string
  group: string
  start: Date
  end: Date
  title: string
  content: string
  status: MissionStatus
  conflict?: boolean
  notes?: string
  tags?: string[] // mission tag ids
}

export type Crew = { id: string; name: string; role: 'Student' | 'Instructor'; rank: string; aircraft: string; quals: string[]; status: 'Available' | 'On Leave' | 'DNIF' }
export type Student = { name: string; phase: string; progress: number; alerts: string[] }
export type NotificationItem = { title: string; when: string; read?: boolean }
export type Aircraft = { tail: string; status: string; notes: string }
export type Simulator = { name: string; status: string; notes: string }

type AppStore = {
  groups: Group[]
  missions: MissionItem[]
  planningMissions: MissionItem[]
  crew: Crew[]
  students: Student[]
  notifications: NotificationItem[]
  aircraft: Aircraft[]
  simulators: Simulator[]
  availableTags: MissionTag[]
  updateMissionStatus: (id: string, status: MissionStatus) => void
  updateMissionWindow: (id: string, start: Date, end: Date) => void
  updatePlanningMissionWindow: (id: string, start: Date, end: Date) => void
  updatePlanningMissionGroup: (id: string, group: string) => void
  addTagToMission: (id: string, tagId: string) => void
  removeTagFromMission: (id: string, tagId: string) => void
  addTagToPlanningMission: (id: string, tagId: string) => void
  removeTagFromPlanningMission: (id: string, tagId: string) => void
  publishPlanningToActive: () => void
  addNotification: (n: NotificationItem) => void
  markAllNotificationsRead: () => void
  createTag: (label: string, color: string, icon?: string, emoji?: string) => MissionTag
  updateTag: (id: string, updates: Partial<MissionTag>) => void
  deleteTag: (id: string) => void
}

const AppStoreContext = createContext<AppStore | null>(null)

function buildDemo() {
  const today = new Date()
  const d = (h: number, m: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0, 0)
  const groups: Group[] = [
    { id: 'AC-101', content: 'Aircraft 101', order: 1, type: 'aircraft' },
    { id: 'AC-202', content: 'Aircraft 202', order: 2, type: 'aircraft' },
    { id: 'AC-303', content: 'Aircraft 303', order: 3, type: 'aircraft' },
    { id: 'AC-404', content: 'Aircraft 404', order: 4, type: 'aircraft' },
    { id: 'SIM-A', content: 'Simulator A', order: 5, type: 'sim' },
    { id: 'SIM-B', content: 'Simulator B', order: 6, type: 'sim' },
    { id: 'SIM-C', content: 'Simulator C', order: 7, type: 'sim' },
    { id: 'SIM-D', content: 'Simulator D', order: 8, type: 'sim' },
  ]
  const availableTags: MissionTag[] = [
    { id: 'night', label: 'Night', color: '#7c3aed', icon: '/assets/icons/night.svg', emoji: '🌙', symbol: '☾' },
    { id: 'checkride', label: 'Checkride', color: '#f59e0b', icon: '/assets/icons/checkride.svg', emoji: '🛡️', symbol: '♦' },
    { id: 'highRisk', label: 'High Risk', color: '#ef4444', icon: '/assets/icons/high-risk.svg', emoji: '⚠️', symbol: '▲' },
    { id: 'sim', label: 'Simulator', color: '#0ea5e9', icon: '/assets/icons/simulator.svg', emoji: '🕹️', symbol: '◉' },
    { id: 'ipReq', label: 'IP Required', color: '#22c55e', icon: '/assets/icons/ip-required.svg', emoji: '🎯', symbol: '●' },
    { id: 'formation', label: 'Formation', color: '#8b5cf6', icon: '/assets/icons/formation.svg', emoji: '✈️', symbol: '◊' },
    { id: 'navigation', label: 'Navigation', color: '#06b6d4', icon: '/assets/icons/navigation.svg', emoji: '🧭', symbol: '◆' },
  ]
  const missions: MissionItem[] = [
    { id: 'M1', group: 'AC-101', start: d(8, 0), end: d(10, 0), title: 'Instrument 1', content: 'Instrument 1', status: 'Planned', tags: ['ipReq'] },
    { id: 'M2', group: 'AC-101', start: d(10, 30), end: d(12, 0), title: 'Formation 1', content: 'Formation 1', status: 'Planned', tags: ['formation', 'highRisk'] },
    { id: 'M3', group: 'AC-202', start: d(9, 0), end: d(11, 30), title: 'Nav 2', content: 'Nav 2', status: 'Planned', tags: ['navigation'] },
    { id: 'M4', group: 'SIM-A', start: d(13, 0), end: d(14, 30), title: 'Sim Check', content: 'Sim Check', status: 'Authorized', tags: ['sim'] },
    { id: 'M5', group: 'SIM-B', start: d(9, 30), end: d(11, 0), title: 'Basic Instruments', content: 'Basic Instruments', status: 'Planned', tags: ['sim', 'ipReq'] },
    { id: 'M6', group: 'AC-202', start: d(12, 0), end: d(13, 0), title: 'Pattern', content: 'Pattern', status: 'Canceled', tags: ['night'] },
  ]
  const crew: Crew[] = [
    { id: '1', name: 'Capt Alex Hunter', role: 'Instructor', rank: 'O-3', aircraft: 'T-6', quals: ['IP', 'IFR'], status: 'Available' },
    { id: '2', name: 'Lt Sam Lee', role: 'Student', rank: 'O-2', aircraft: 'T-6', quals: ['Inst Phase'], status: 'Available' },
    { id: '3', name: 'Lt Maria Gomez', role: 'Student', rank: 'O-2', aircraft: 'T-6', quals: ['Contact'], status: 'On Leave' },
    { id: '4', name: 'Maj Chris Park', role: 'Instructor', rank: 'O-4', aircraft: 'T-6', quals: ['IP', 'Check Pilot'], status: 'Available' },
  ]
  const students: Student[] = [
    { name: 'Lt Sam Lee', phase: 'Instruments', progress: 45, alerts: ['IFR check due in 14 days'] },
    { name: 'Lt Maria Gomez', phase: 'Contact', progress: 20, alerts: [] },
  ]
  const notifications: NotificationItem[] = [
    { title: 'Schedule updated: Nav 2 moved to 09:00', when: 'Yesterday 17:04' },
    { title: 'Mission M4 authorized by Maj Park', when: 'Today 09:12', read: false },
  ]
  const aircraft: Aircraft[] = [
    { tail: 'AC-101', status: 'Available', notes: 'Preferred for Instruments' },
    { tail: 'AC-202', status: 'Down for maintenance', notes: 'Phase inspection' },
    { tail: 'AC-303', status: 'Available', notes: 'Good for Formation' },
    { tail: 'AC-404', status: 'Available', notes: 'Fresh out of maintenance' },
  ]
  const simulators: Simulator[] = [
    { name: 'SIM-A', status: 'Available', notes: 'Bay 1' },
    { name: 'SIM-B', status: 'Available', notes: 'Bay 2' },
    { name: 'SIM-C', status: 'Available', notes: 'Bay 3' },
    { name: 'SIM-D', status: 'Available', notes: 'Bay 4' },
  ]
  const planningMissions: MissionItem[] = missions.map((m) => ({ ...m }))
  return { groups, missions, planningMissions, crew, students, notifications, aircraft, simulators, availableTags }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const demo = useMemo(buildDemo, [])
  const [missions, setMissions] = useState<MissionItem[]>(demo.missions)
  const [planningMissions, setPlanningMissions] = useState<MissionItem[]>(demo.planningMissions)
  const [notifications, setNotifications] = useState<NotificationItem[]>(demo.notifications)
  const [availableTags, setAvailableTags] = useState<MissionTag[]>(demo.availableTags)

  const value: AppStore = {
    groups: demo.groups,
    crew: demo.crew,
    students: demo.students,
    aircraft: demo.aircraft,
    simulators: demo.simulators,
    availableTags,
    missions,
    planningMissions,
    notifications,
    updateMissionStatus: (id, status) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))),
    updateMissionWindow: (id, start, end) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, start, end } : m))),
    addTagToMission: (id, tagId) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, tags: Array.from(new Set([...(m.tags || []), tagId])) } : m))),
    removeTagFromMission: (id, tagId) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, tags: (m.tags || []).filter((t) => t !== tagId) } : m))),
    updatePlanningMissionWindow: (id, start, end) => setPlanningMissions((prev) => prev.map((m) => (m.id === id ? { ...m, start, end } : m))),
    updatePlanningMissionGroup: (id, group) => setPlanningMissions((prev) => prev.map((m) => (m.id === id ? { ...m, group } : m))),
    addTagToPlanningMission: (id, tagId) => setPlanningMissions((prev) => prev.map((m) => (m.id === id ? { ...m, tags: Array.from(new Set([...(m.tags || []), tagId])) } : m))),
    removeTagFromPlanningMission: (id, tagId) => setPlanningMissions((prev) => prev.map((m) => (m.id === id ? { ...m, tags: (m.tags || []).filter((t) => t !== tagId) } : m))),
    publishPlanningToActive: () => setMissions(() => planningMissions.map((m) => ({ ...m, status: m.status === 'Canceled' ? 'Canceled' : 'Planned' }))),
    addNotification: (n) => setNotifications((p) => [n, ...p]),
    markAllNotificationsRead: () => setNotifications((p) => p.map((n) => ({ ...n, read: true }))),
    createTag: (label: string, color: string, icon?: string, emoji?: string) => {
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `tag-${Date.now()}`
      const tag: MissionTag = { id, label, color, icon, emoji }
      setAvailableTags((prev) => [...prev, tag])
      return tag
    },
    updateTag: (id: string, updates: Partial<MissionTag>) => {
      setAvailableTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, id: t.id } : t)))
    },
    deleteTag: (id: string) => {
      setAvailableTags((prev) => prev.filter((t) => t.id !== id))
      setMissions((prev) => prev.map((m) => ({ ...m, tags: (m.tags || []).filter((tid) => tid !== id) })))
      setPlanningMissions((prev) => prev.map((m) => ({ ...m, tags: (m.tags || []).filter((tid) => tid !== id) })))
    },
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}


