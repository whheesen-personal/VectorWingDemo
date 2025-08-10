'use client'

import TopNav from '../../components/TopNav'
import { useAppStore } from '../../state/store'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

export default function NotificationsPage() {
  const store = useAppStore()
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <TopNav active="notifications" />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <NotificationsActiveIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Preferences</Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack>
                  <FormControlLabel control={<Switch defaultChecked />} label="Schedule changes" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Authorization status" />
                  <FormControlLabel control={<Switch />} label="Training results" />
                  <FormControlLabel control={<Switch />} label="Announcements" />
                  <Divider sx={{ my: 1 }} />
                  <Button variant="outlined" size="small">Send test notification</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Notifications</Typography>
                <List>
                  {store.notifications.map((n, idx) => (
                    <ListItem key={idx} secondaryAction={!n.read ? <Chip label="New" size="small" color="success" /> : undefined}>
                      <ListItemText primary={n.title} secondary={n.when} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}


