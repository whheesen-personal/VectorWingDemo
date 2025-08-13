# Icon System Documentation

## Overview

We've implemented a comprehensive icon system for the FlightPro2 application that provides:

1. **High-quality SVG icons** organized by categories
2. **Dynamic color generation** for all icons
3. **Custom icon upload** support (PNG/JPG/SVG)
4. **Icon library browser** with preview functionality
5. **Integration with the tag system** for mission planning

## Features

### 1. Icon Library (`IconLibrary.tsx`)

The icon library contains 24 high-quality SVG icons organized into 6 categories:

- **Aviation & Flight**: airplane, helicopter, runway, radar
- **Weather & Conditions**: sun, moon, cloud, storm
- **Training & Skills**: graduation, target, shield, book
- **Equipment & Tools**: headset, controller, compass, map
- **Safety & Risk**: warning, danger, safety, check
- **Time & Schedule**: clock, calendar, timer, stopwatch

### 2. Dynamic Color System

- All icons support dynamic color changes
- 8 predefined color options available
- Icons automatically update when colors change
- SVG-based for crisp rendering at any size

### 3. Custom Icon Upload

- Support for PNG, JPG, and SVG files
- Drag-and-drop interface
- File preview before upload
- Integration with tag creation system

### 4. Tag Creation Dialog (`CreateTagDialog.tsx`)

- Two-tab interface:
  - **Icon Library**: Browse and select from built-in icons
  - **Upload Custom**: Upload your own image files
- Real-time preview of selected icons
- Color picker for customization

## Usage

### Creating Tags with Icons

1. **From Icon Library**:
   - Click "Create Tag" button
   - Select "Icon Library" tab
   - Choose an icon from the categories
   - Pick a color from the color palette
   - Enter tag label
   - Click "Create Tag"

2. **From Custom Upload**:
   - Click "Create Tag" button
   - Select "Upload Custom" tab
   - Choose a color
   - Upload your image file
   - Enter tag label
   - Click "Create Tag"

### Icon Categories

#### Aviation & Flight
- **Airplane**: General aviation missions
- **Helicopter**: Rotary-wing operations
- **Runway**: Ground operations
- **Radar**: Navigation and surveillance

#### Weather & Conditions
- **Sun**: Day operations
- **Moon**: Night operations
- **Cloud**: Weather-dependent missions
- **Storm**: Adverse weather conditions

#### Training & Skills
- **Graduation**: Training missions
- **Target**: Target practice
- **Shield**: Safety training
- **Book**: Academic training

#### Equipment & Tools
- **Headset**: Communication equipment
- **Controller**: Simulation equipment
- **Compass**: Navigation equipment
- **Map**: Planning tools

#### Safety & Risk
- **Warning**: Caution required
- **Danger**: High-risk operations
- **Safety**: Safety protocols
- **Check**: Verification required

#### Time & Schedule
- **Clock**: Time-sensitive operations
- **Calendar**: Scheduled events
- **Timer**: Timed missions
- **Stopwatch**: Performance tracking

## Technical Implementation

### Icon Definition Structure

```typescript
interface IconDefinition {
  id: string;
  name: string;
  category: string;
  path: string;        // SVG path data
  viewBox: string;     // SVG viewBox
  defaultColor?: string;
}
```

### SVG Generation

Icons are generated as SVG strings with custom colors:

```typescript
function generateIconSVG(icon: IconDefinition, color: string): string
```

### Data URL Generation

For custom icons, data URLs are generated:

```typescript
function generateIconDataURL(icon: IconDefinition, color: string): string
```

## Integration Points

### Planning Page
- Icon library accessible via "Create Tag" button
- Tags with icons display in mission timeline
- Icon upload functionality in legend section

### Demo Page
- Standalone demonstration of icon system
- Interactive icon selection and preview
- Tag creation showcase

## Future Enhancements

1. **Icon Search**: Add search functionality to find icons quickly
2. **Custom Icon Categories**: Allow users to create custom icon categories
3. **Icon Templates**: Provide icon templates for common use cases
4. **Batch Operations**: Support for creating multiple tags at once
5. **Icon Export**: Allow users to export custom icon sets

## File Structure

```
src/
├── components/
│   ├── IconLibrary.tsx          # Main icon library component
│   ├── CreateTagDialog.tsx      # Tag creation dialog
│   └── IconUpload.tsx           # Custom icon upload component
├── app/
│   ├── planning/page.tsx        # Planning page with icon integration
│   └── demo/page.tsx            # Icon system demo page
└── state/
    └── store.tsx                # Store with tag management
```

## Browser Support

- **SVG Icons**: All modern browsers
- **Custom Uploads**: PNG/JPG (all browsers), SVG (modern browsers)
- **Color Picker**: All modern browsers with HTML5 color input support

## Performance Considerations

- Icons are generated as SVG strings (lightweight)
- Custom icons stored as data URLs (no external requests)
- Icon library loaded on-demand
- Efficient rendering in timeline components
