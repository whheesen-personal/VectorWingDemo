'use client'

import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' },
    background: { default: '#0b1320', paper: '#0f1a2b' },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial',
  },
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}


