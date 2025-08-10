'use client'

import React from 'react'
import { Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts'

// Mock data for KPI dashboard
const trendByWeek = [
  { week: 'Wk 1', completion: 72, utilization: 61, cancels: 18 },
  { week: 'Wk 2', completion: 78, utilization: 66, cancels: 15 },
  { week: 'Wk 3', completion: 81, utilization: 69, cancels: 13 },
  { week: 'Wk 4', completion: 84, utilization: 70, cancels: 12 },
  { week: 'Wk 5', completion: 86, utilization: 74, cancels: 12 },
  { week: 'Wk 6', completion: 88, utilization: 75, cancels: 10 },
]

const progressDistribution = [
  { stage: 'Ground', pct: 20 },
  { stage: 'Basic', pct: 28 },
  { stage: 'Advanced', pct: 34 },
  { stage: 'Checkride', pct: 18 },
]

const cancelReasons = [
  { reason: 'Weather', value: 38 },
  { reason: 'MX', value: 22 },
  { reason: 'Crew', value: 17 },
  { reason: 'Ops', value: 12 },
  { reason: 'Airspace', value: 11 },
]

const COLORS = ['#60a5fa', '#22c55e', '#f59e0b', '#a78bfa', '#38bdf8']

export function KpiTrendCard() {
  return (
    <Card sx={{ height: 300 }}>
      <CardContent sx={{ height: 300 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
            Weekly Completion & Utilization
          </Typography>
          <Chip size="small" label="Last 6 weeks" variant="outlined" />
        </Stack>
        <Box sx={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendByWeek} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="week" tick={{ fill: '#9fb3c8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#9fb3c8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{ background: '#0f1a2b', border: '1px solid #243049', borderRadius: 8 }}
                labelStyle={{ color: '#e6edf3' }}
              />
              <Legend wrapperStyle={{ color: '#9fb3c8' }} />
              <Area type="monotone" dataKey="completion" name="Completion" stroke="#60a5fa" fillOpacity={1} fill="url(#colorCompletion)" />
              <Area type="monotone" dataKey="utilization" name="Utilization" stroke="#22c55e" fillOpacity={1} fill="url(#colorUtil)" />
              <Line type="monotone" dataKey="cancels" name="Cancels" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} yAxisId={1} />
              <YAxis yAxisId={1} orientation="right" tick={{ fill: '#9fb3c8', fontSize: 12 }} axisLine={false} tickLine={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export function ProgressDistributionCard() {
  return (
    <Card sx={{ height: 300 }}>
      <CardContent sx={{ height: 300 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
          Student Progress Distribution
        </Typography>
        <Box sx={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressDistribution} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="stage" tick={{ fill: '#9fb3c8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9fb3c8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#0f1a2b', border: '1px solid #243049', borderRadius: 8 }} labelStyle={{ color: '#e6edf3' }} />
              <Bar dataKey="pct" name="% of students" radius={[6, 6, 0, 0]} fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export function CancelReasonsCard() {
  return (
    <Card sx={{ height: 300 }}>
      <CardContent sx={{ height: 300 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
          Cancelation Causes (Last 30 days)
        </Typography>
        <Box sx={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={cancelReasons} dataKey="value" nameKey="reason" innerRadius={55} outerRadius={90} paddingAngle={4}>
                {cancelReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: '#9fb3c8' }} />
              <Tooltip contentStyle={{ background: '#0f1a2b', border: '1px solid #243049', borderRadius: 8 }} labelStyle={{ color: '#e6edf3' }} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export function KpiStatCard({ title, value, delta, deltaLabel }: { title: string; value: string; delta?: string; deltaLabel?: string }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>{title}</Typography>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
          {delta && <Chip size="small" label={`${delta} ${deltaLabel ?? ''}`.trim()} color={String(delta).startsWith('-') ? 'error' : 'success'} />}
        </Stack>
      </CardContent>
    </Card>
  )
}


