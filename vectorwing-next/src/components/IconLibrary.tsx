import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

export interface IconDefinition {
  id: string;
  name: string;
  category: string;
  path: string;
  viewBox: string;
  defaultColor?: string;
}

// High-quality SVG icon definitions
export const iconLibrary: IconDefinition[] = [
  // Aviation & Flight
  { id: 'airplane', name: 'Airplane', category: 'aviation', path: 'M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#3B82F6' },
  { id: 'helicopter', name: 'Helicopter', category: 'aviation', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#10B981' },
  { id: 'runway', name: 'Runway', category: 'aviation', path: 'M3 3H21V5H3V3ZM3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15ZM3 19H21V21H3V19Z', viewBox: '0 0 24 24', defaultColor: '#6B7280' },
  { id: 'radar', name: 'Radar', category: 'aviation', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 18 12 18Z', viewBox: '0 0 24 24', defaultColor: '#8B5CF6' },
  
  // Weather & Conditions
  { id: 'sun', name: 'Sun', category: 'weather', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#F59E0B' },
  { id: 'moon', name: 'Moon', category: 'weather', path: 'M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z', viewBox: '0 0 24 24', defaultColor: '#7C3AED' },
  { id: 'cloud', name: 'Cloud', category: 'weather', path: 'M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z', viewBox: '0 0 24 24', defaultColor: '#94A3B8' },
  { id: 'storm', name: 'Storm', category: 'weather', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#64748B' },
  
  // Training & Skills
  { id: 'graduation', name: 'Graduation', category: 'training', path: 'M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z', viewBox: '0 0 24 24', defaultColor: '#22C55E' },
  { id: 'target', name: 'Target', category: 'training', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 18 12 18Z', viewBox: '0 0 24 24', defaultColor: '#EF4444' },
  { id: 'shield', name: 'Shield', category: 'training', path: 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 21C7.82 19.23 5 15.27 5 11V6.3L12 2.19L19 6.3V11C19 15.27 16.18 19.23 12 21Z', viewBox: '0 0 24 24', defaultColor: '#F59E0B' },
  { id: 'book', name: 'Book', category: 'training', path: 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19Z', viewBox: '0 0 24 24', defaultColor: '#8B5CF6' },
  
  // Equipment & Tools
  { id: 'headset', name: 'Headset', category: 'equipment', path: 'M12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H18C19.66 20 21 18.66 21 17V10C21 5.03 16.97 1 12 1Z', viewBox: '0 0 24 24', defaultColor: '#06B6D4' },
  { id: 'controller', name: 'Controller', category: 'equipment', path: 'M17.5 0C20.54 0 23 2.46 23 5.5C23 8.54 20.54 11 17.5 11C14.46 11 12 8.54 12 5.5C12 2.46 14.46 0 17.5 0ZM17.5 2C15.57 2 14 3.57 14 5.5C14 7.43 15.57 9 17.5 9C19.43 9 21 7.43 21 5.5C21 3.57 19.43 2 17.5 2ZM17.5 4C18.05 4 18.5 4.45 18.5 5C18.5 5.55 18.05 6 17.5 6C16.95 6 16.5 5.55 16.5 5C16.5 4.45 16.95 4 17.5 4Z', viewBox: '0 0 24 24', defaultColor: '#0EA5E9' },
  { id: 'compass', name: 'Compass', category: 'equipment', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#06B6D4' },
  { id: 'map', name: 'Map', category: 'equipment', path: 'M20.5 3L20.34 3.03L15 5.1L9 3L3.36 4.9C3.15 4.97 3 5.15 3 5.38V20.5C3 20.78 3.22 21 3.5 21L3.66 20.97L9 18.9L15 21L20.64 19.1C20.85 19.03 21 18.85 21 18.62V3.5C21 3.22 20.78 3 20.5 3ZM15 19L9 16.89V5L15 7.11V19Z', viewBox: '0 0 24 24', defaultColor: '#10B981' },
  
  // Safety & Risk
  { id: 'warning', name: 'Warning', category: 'safety', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#F59E0B' },
  { id: 'danger', name: 'Danger', category: 'safety', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#EF4444' },
  { id: 'safety', name: 'Safety', category: 'safety', path: 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 21C7.82 19.23 5 15.27 5 11V6.3L12 2.19L19 6.3V11C19 15.27 16.18 19.23 12 21Z', viewBox: '0 0 24 24', defaultColor: '#22C55E' },
  { id: 'check', name: 'Check', category: 'safety', path: 'M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z', viewBox: '0 0 24 24', defaultColor: '#22C55E' },
  
  // Time & Schedule
  { id: 'clock', name: 'Clock', category: 'time', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z', viewBox: '0 0 24 24', defaultColor: '#6B7280' },
  { id: 'calendar', name: 'Calendar', category: 'time', path: 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V8H19V19Z', viewBox: '0 0 24 24', defaultColor: '#8B5CF6' },
  { id: 'timer', name: 'Timer', category: 'time', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z', viewBox: '0 0 24 24', defaultColor: '#F59E0B' },
  { id: 'stopwatch', name: 'Stopwatch', category: 'time', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z', viewBox: '0 0 24 24', defaultColor: '#EF4444' },
  
  // Additional Aviation Icons
  { id: 'parachute', name: 'Parachute', category: 'aviation', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z', viewBox: '0 0 24 24', defaultColor: '#F59E0B' },
  { id: 'glider', name: 'Glider', category: 'aviation', path: 'M12 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L4 9.27L10.91 8.26L12 2Z', viewBox: '0 0 24 24', defaultColor: '#06B6D4' },
  { id: 'fuel', name: 'Fuel', category: 'aviation', path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z', viewBox: '0 0 24 24', defaultColor: '#EF4444' },
];

// Generate icon SVG with custom color
export function generateIconSVG(icon: IconDefinition, color: string): string {
  return `<svg width="16" height="16" viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${icon.path}" fill="${color}"/>
  </svg>`;
}

// Generate data URL for icon
export function generateIconDataURL(icon: IconDefinition, color: string): string {
  const svg = generateIconSVG(icon, color);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}

interface IconLibraryProps {
  onSelectIcon: (icon: IconDefinition, color: string) => void;
  selectedIconId?: string;
  selectedColor?: string;
}

export function IconLibrary({ onSelectIcon, selectedIconId, selectedColor }: IconLibraryProps) {
  const [selectedIcon, setSelectedIcon] = React.useState<IconDefinition | null>(
    iconLibrary.find(icon => icon.id === selectedIconId) || null
  );
  const [selectedColorValue, setSelectedColorValue] = React.useState(selectedColor || '#3B82F6');

  const handleIconSelect = (icon: IconDefinition) => {
    setSelectedIcon(icon);
    onSelectIcon(icon, selectedColorValue);
  };

  const handleColorChange = (color: string) => {
    setSelectedColorValue(color);
    if (selectedIcon) {
      onSelectIcon(selectedIcon, color);
    }
  };

  const categories = [...new Set(iconLibrary.map(icon => icon.category))];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Icon & Color
      </Typography>
      
      {/* Color Picker */}
      <Box mb={2}>
        <Typography variant="subtitle2" gutterBottom>
          Color
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#6B7280', '#22C55E'].map((color) => (
            <Box
              key={color}
              onClick={() => handleColorChange(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: selectedColorValue === color ? '3px solid #000' : '2px solid #ddd',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'all 0.2s'
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Icon Categories */}
      {categories.map((category) => (
        <Box key={category} mb={3}>
          <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
            {category}
          </Typography>
          <Grid container spacing={1}>
            {iconLibrary
              .filter(icon => icon.category === category)
              .map((icon) => (
                <Grid item key={icon.id}>
                  <Paper
                    elevation={selectedIcon?.id === icon.id ? 4 : 1}
                    onClick={() => handleIconSelect(icon)}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      border: selectedIcon?.id === icon.id ? '2px solid #3B82F6' : '2px solid transparent',
                      '&:hover': { transform: 'scale(1.05)', elevation: 2 },
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48
                    }}
                  >
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: generateIconSVG(icon, selectedColorValue)
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
