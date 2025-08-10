'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export type Group = { id: string; content: string; order: number; type: 'aircraft' | 'sim' }
export type MissionStatus = 'Planned' | 'Authorized' | 'Canceled'
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
}

export type Crew = { id: string; name: string; role: 'Student' | 'Instructor'; rank: string; aircraft: string; quals: string[]; status: 'Available' | 'On Leave' | 'DNIF' }
export type Student = { name: string; phase: string; progress: number; alerts: string[] }
export type NotificationItem = { title: string; when: string; read?: boolean }
export type Aircraft = { tail: string; status: string; notes: string }
export type Simulator = { name: string; status: string; notes: string }

type AppStore = {
  groups: Group[]
  missions: MissionItem[]
  crew: Crew[]
  students: Student[]
  notifications: NotificationItem[]
  aircraft: Aircraft[]
  simulators: Simulator[]
  updateMissionStatus: (id: string, status: MissionStatus) => void
  updateMissionWindow: (id: string, start: Date, end: Date) => void
  addNotification: (n: NotificationItem) => void
  markAllNotificationsRead: () => void
}

const AppStoreContext = createContext<AppStore | null>(null)

function buildDemo() {
  const today = new Date()
  const d = (h: number, m: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0, 0)
  const groups: Group[] = [
    { id: 'AC-101', content: 'Aircraft 101', order: 1, type: 'aircraft' },
    { id: 'AC-202', content: 'Aircraft 202', order: 2, type: 'aircraft' },
    { id: 'SIM-A', content: 'Simulator A', order: 3, type: 'sim' },
    { id: 'SIM-B', content: 'Simulator B', order: 4, type: 'sim' },
  ]
  const missions: MissionItem[] = [
    { id: 'M1', group: 'AC-101', start: d(8, 0), end: d(10, 0), title: 'Instrument 1', content: 'Instrument 1', status: 'Planned' },
    { id: 'M2', group: 'AC-101', start: d(10, 30), end: d(12, 0), title: 'Formation 1', content: 'Formation 1', status: 'Planned' },
    { id: 'M3', group: 'AC-202', start: d(9, 0), end: d(11, 30), title: 'Nav 2', content: 'Nav 2', status: 'Planned' },
    { id: 'M4', group: 'SIM-A', start: d(13, 0), end: d(14, 30), title: 'Sim Check', content: 'Sim Check', status: 'Authorized' },
    { id: 'M5', group: 'SIM-B', start: d(9, 30), end: d(11, 0), title: 'Basic Instruments', content: 'Basic Instruments', status: 'Planned' },
    { id: 'M6', group: 'AC-202', start: d(12, 0), end: d(13, 0), title: 'Pattern', content: 'Pattern', status: 'Canceled' },
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
  ]
  const simulators: Simulator[] = [
    { name: 'SIM-A', status: 'Available', notes: 'Bay 1' },
    { name: 'SIM-B', status: 'Available', notes: 'Bay 2' },
  ]
  return { groups, missions, crew, students, notifications, aircraft, simulators }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const demo = useMemo(buildDemo, [])
  const [missions, setMissions] = useState<MissionItem[]>(demo.missions)
  const [notifications, setNotifications] = useState<NotificationItem[]>(demo.notifications)

  const value: AppStore = {
    groups: demo.groups,
    crew: demo.crew,
    students: demo.students,
    aircraft: demo.aircraft,
    simulators: demo.simulators,
    missions,
    notifications,
    updateMissionStatus: (id, status) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))),
    updateMissionWindow: (id, start, end) => setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, start, end } : m))),
    addNotification: (n) => setNotifications((p) => [n, ...p]),
    markAllNotificationsRead: () => setNotifications((p) => p.map((n) => ({ ...n, read: true }))),
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}


