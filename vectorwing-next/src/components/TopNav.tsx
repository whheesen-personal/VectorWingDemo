'use client'

import Link from 'next/link'
import { AppBar, Toolbar, Typography, Stack, Button, Chip, Box, Badge } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SchoolIcon from '@mui/icons-material/School'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import SettingsIcon from '@mui/icons-material/Settings'
import CircleIcon from '@mui/icons-material/Circle'
import { useAppStore } from '../state/store'

type TopNavProps = {
  active?:
    | 'schedule'
    | 'crew'
    | 'authorization'
    | 'training'
    | 'notifications'
    | 'reporting'
    | 'resources'
    | 'admin'
}

export default function TopNav({ active = 'schedule' }: TopNavProps) {
  const { missions, notifications } = useAppStore()
  const planned = missions.filter((m) => m.status === 'Planned').length
  const authorized = missions.filter((m) => m.status === 'Authorized').length
  const unread = notifications.filter((n) => !n.read).length
  const linkSx = (tab: string) => ({
    fontWeight: 700,
    color: active === tab ? 'primary.main' : 'text.primary',
    backgroundColor: active === tab ? 'action.selected' : 'transparent',
    '&:hover': { backgroundColor: 'action.hover' },
  })

  const notifButton = (
    <Button component={Link} href="/notifications" startIcon={<NotificationsIcon />} sx={linkSx('notifications')}>
      Notifications
    </Button>
  )

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #243049', backdropFilter: 'blur(6px)', background: 'rgba(11,19,32,0.6)' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5, mr: 2 }}>
          VectorWing
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={Link} href="/" startIcon={<CalendarMonthIcon />} sx={linkSx('schedule')}>
            Schedule
            <Chip size="small" label={`${planned}/${authorized}`} sx={{ ml: 1 }} />
          </Button>
          <Button component={Link} href="/crew" startIcon={<GroupsIcon />} sx={linkSx('crew')}>
            Crew
          </Button>
          <Button component={Link} href="/authorization" startIcon={<VerifiedUserIcon />} sx={linkSx('authorization')}>
            Authorize
          </Button>
          <Button component={Link} href="/training" startIcon={<SchoolIcon />} sx={linkSx('training')}>
            Training
          </Button>
          {unread > 0 ? (
            <Badge
              badgeContent={unread}
              color="error"
              overlap="rectangular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  right: -8,
                  top: 6,
                  fontWeight: 800,
                  fontSize: 11,
                  height: 18,
                  minWidth: 18,
                  lineHeight: '18px',
                  padding: '0 6px',
                  borderRadius: 9999,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.35)'
                },
              }}
            >
              {notifButton}
            </Badge>
          ) : (
            notifButton
          )}
          <Button component={Link} href="/reporting" startIcon={<AssessmentIcon />} sx={linkSx('reporting')}>
            Reporting
          </Button>
          <Button component={Link} href="/resources" startIcon={<PrecisionManufacturingIcon />} sx={linkSx('resources')}>
            Resources
          </Button>
          <Button component={Link} href="/admin" startIcon={<SettingsIcon />} sx={linkSx('admin')}>
            Admin
          </Button>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Chip label="Prototype" color="info" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
      </Toolbar>
    </AppBar>
  )
}


