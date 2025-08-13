import React, { useState, useRef } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'

interface IconUploadProps {
  onUpload: (file: File, label: string) => void
  open: boolean
  onClose: () => void
  showLabel?: boolean
}

export default function IconUpload({ onUpload, open, onClose, showLabel = true }: IconUploadProps) {
  const [label, setLabel] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile && label.trim()) {
      onUpload(selectedFile, label.trim())
      setLabel('')
      setSelectedFile(null)
      onClose()
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Custom Icon</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {showLabel && (
            <TextField
              fullWidth
              label="Icon Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Weather, Emergency, etc."
              sx={{ mb: 2 }}
            />
          )}
          
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: '#999' }
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <Box>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '64px', maxHeight: '64px', marginBottom: '8px' }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedFile.name}
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Click to select or drag & drop an image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG, JPG, or SVG files supported
                </Typography>
              </Box>
            )}
          </Box>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpload} 
          variant="contained" 
          disabled={!selectedFile || (showLabel && !label.trim())}
        >
          Upload Icon
        </Button>
      </DialogActions>
    </Dialog>
  )
}
