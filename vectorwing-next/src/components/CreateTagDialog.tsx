import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { IconLibrary, IconDefinition, generateIconDataURL } from './IconLibrary';
import IconUpload from './IconUpload';

interface CreateTagDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTag: (label: string, color: string, iconPath?: string) => void;
  useIconLibrary?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`create-tag-tabpanel-${index}`}
      aria-labelledby={`create-tag-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function CreateTagDialog({ open, onClose, onCreateTag, useIconLibrary = false }: CreateTagDialogProps) {
  const [label, setLabel] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconDefinition | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [tabValue, setTabValue] = useState(useIconLibrary ? 0 : 1);

  const handleIconSelect = (icon: IconDefinition, color: string) => {
    setSelectedIcon(icon);
    setSelectedColor(color);
  };

  const handleCreate = () => {
    if (label.trim() && selectedIcon) {
      const iconPath = generateIconDataURL(selectedIcon, selectedColor);
      onCreateTag(label.trim(), selectedColor, iconPath);
      handleClose();
    }
  };

  const handleClose = () => {
    setLabel('');
    setSelectedIcon(null);
    setSelectedColor('#3B82F6');
    setTabValue(useIconLibrary ? 0 : 1);
    onClose();
  };

  const handleFileUpload = (file: File, uploadedLabel: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onCreateTag(uploadedLabel || label || 'Custom Icon', selectedColor, dataUrl);
      handleClose();
    };
    reader.readAsDataURL(file);
  };

  const canCreate = label.trim() && (selectedIcon || tabValue === 1);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="create-tag-dialog-title"
      disablePortal={false}
      keepMounted={false}
    >
      <DialogTitle id="create-tag-dialog-title">
        Create New Tag
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="create tag options"
          >
            <Tab label="Icon Library" id="create-tag-tab-0" aria-controls="create-tag-tabpanel-0" />
            <Tab label="Upload Custom" id="create-tag-tab-1" aria-controls="create-tag-tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Tag Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter tag name..."
              variant="outlined"
            />
          </Box>
          
          <IconLibrary
            onSelectIcon={handleIconSelect}
            selectedIconId={selectedIcon?.id}
            selectedColor={selectedColor}
          />
          
          {selectedIcon && (
            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: selectedIcon ? `<svg width="20" height="20" viewBox="${selectedIcon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${selectedIcon.path}" fill="${selectedColor}"/></svg>` : ''
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedIcon.name} in {selectedColor}
                </Typography>
              </Box>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Tag Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter tag name..."
              variant="outlined"
            />
          </Box>
          
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Color:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#6B7280', '#22C55E'].map((color) => (
                <Box
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '3px solid #000' : '2px solid #ddd',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <IconUpload
            open={false}
            onClose={() => {}}
            onUpload={handleFileUpload}
            showLabel={false}
          />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleCreate} 
          variant="contained" 
          disabled={!canCreate}
        >
          Create Tag
        </Button>
      </DialogActions>
    </Dialog>
  );
}
