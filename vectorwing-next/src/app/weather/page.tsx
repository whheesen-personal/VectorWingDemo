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
  TextField,
  Divider,
} from '@mui/material'

type Metar = {
  station: string
  observed: string
  raw: string
  wind?: string
  vis?: string
  qnh?: string
  temp?: string
  sky?: string
  ageMin: number
}

type Taf = { station: string; issued: string; lines: string[] }

const demoMetar: Metar[] = [
  {
    station: 'OTBH',
    observed: '110755Z',
    raw: 'METAR OTBH 110755Z 20013G18KT 9000 HZ CLR 44/18 A2954 Q1000 RMK AO2A SLP003 T04410106 $',
    wind: '20013G18KT',
    vis: '9000',
    qnh: 'Q1000',
    temp: '44/18',
    sky: 'CLR',
    ageMin: 67,
  },
  {
    station: 'OTHH',
    observed: '110800Z',
    raw: 'METAR OTHH 110800Z AUTO 14013KT CAVOK 40/22 Q1001 NOSIG',
    wind: '14013KT',
    vis: 'CAVOK',
    qnh: 'Q1001',
    temp: '40/22',
    sky: 'CAVOK',
    ageMin: 62,
  },
]

const demoTaf: Taf[] = [
  {
    station: 'OTBH',
    issued: '110800Z',
    lines: [
      'TAF OTBH 110800Z 1108/1214 20010G20KT 8000 HZ SKC',
      'BECMG 1114/1115 09006KT 9999 NSW SKC',
      'BECMG 1205/1206 19012G18KT 8000 HZ SKC',
      'TX47/1111Z TN32/1201Z',
    ],
  },
  {
    station: 'OTHH',
    issued: '110507Z',
    lines: [
      'TAF OTHH 110507Z 1106/1212 15012KT 8000 NSC',
      'TEMPO 1110/1119 08011KT',
    ],
  },
]

export default function WeatherPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="weather" />
      <Container maxWidth={false} sx={{ py: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AirfieldStatus />
            <Box sx={{ height: 12 }} />
            <ExtraInfo />
          </Grid>
          <Grid item xs={12} md={8}>
            <WxPanels />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

function AirfieldStatus() {
  return (
    <Card sx={{ background: 'linear-gradient(180deg, var(--panel) 0%, var(--panel-2) 100%)', border: '1px solid #243049' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Airfield Status</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <StatusBlock title="Runway" value="16" sublabel="OTBH" color="#22c55e" />
          </Grid>
          <Grid item xs={6}>
            <StatusBlock title="Fuel" value="350" sublabel="OTBT" color="#22c55e" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--muted)' }}>SOF</Typography>
          <TextField size="small" fullWidth placeholder="PHIL" value="PHIL" />
        </Box>
      </CardContent>
    </Card>
  )
}

function StatusBlock({ title, value, sublabel, color }: { title: string; value: string; sublabel: string; color: string }) {
  return (
    <Box sx={{ p: 1, border: '1px solid #243049', borderRadius: 1 }}>
      <Typography variant="body2" sx={{ color: 'var(--muted)', fontWeight: 700 }}>{title}</Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ my: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>{value}</Typography>
        <Chip size="small" label={sublabel} sx={{ fontWeight: 800, background: color, color: '#06130a' }} />
      </Stack>
      <Box sx={{ height: 12, borderRadius: 0.5, background: color }} />
    </Box>
  )
}

function ExtraInfo() {
  return (
    <Card sx={{ border: '1px solid #243049' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Additional Information</Typography>
        <Box component="pre" sx={{ m: 0, p: 1, borderRadius: 1, background: 'rgba(255,255,255,0.03)', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
          {`>STEP TIME: FW13, INT CRS3 & AFT - 35 MIN\n>SBY GROUND FRQ : 118.00\n\n—\n>METAR OTBT: 0800Z 21017KT 9999 FEW180 43/16 Q1000\n>RW: 16L/R`}
        </Box>
      </CardContent>
    </Card>
  )
}

function WxPanels() {
  return (
    <Grid container spacing={2}>
      {demoMetar.map((m) => (
        <Grid item xs={12} key={m.station}>
          <Card sx={{ border: '1px solid #243049' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{m.station}</Typography>
                <Chip size="small" label={`${m.ageMin}m ago`} color="success" variant="outlined" />
              </Stack>
              <WxText text={m.raw} />
              <Divider sx={{ my: 1 }} />
              {demoTaf.filter((t) => t.station === m.station).map((t) => (
                <Box key={t.station}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--muted)' }}>TAF {t.station} {t.issued}</Typography>
                  <WxText text={t.lines.join('\n')} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

function WxText({ text }: { text: string }) {
  return (
    <Box component="pre" sx={{ m: 0, p: 1, borderRadius: 1, background: 'rgba(255,255,255,0.03)', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
      {text}
    </Box>
  )
}


