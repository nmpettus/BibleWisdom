# Health Timeline App

A comprehensive web application for tracking and managing your health events, medical appointments, and health milestones.

## Features

### ✨ Core Functionality
- **Dashboard/Home Screen**: View statistics and recent events at a glance
- **Timeline View**: Chronological display of all health events grouped by month
- **Event Management**: Add, edit, and delete health events
- **Import/Export**: Import and export your health data as JSON files
- **Event Categories**: Organize events by type (Appointment, Medication, Symptom, Test, Procedure, etc.)
- **Milestones**: Mark important health events as milestones
- **Tags**: Add custom tags to events for better organization
- **Notes**: Add detailed notes to any health event

### 🎨 Design
- Professional, elegant design with high contrast for readability
- Responsive layout that works on mobile, tablet, and desktop
- Clean typography with -apple-system font stack
- Smooth animations and transitions
- Visual timeline with connecting lines and dots
- Milestone events highlighted with special styling

### 💾 Data Storage
- Client-side storage using browser localStorage
- Import/export functionality for data portability and backup
- Automatic timestamps for created and updated dates
- Data validation during import

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Time Setup

1. Start the development server: `npm run dev`
2. Open your browser to the local URL (typically http://localhost:5173)
3. You'll see the empty Dashboard screen

### Importing Sample Data

To test the app with sample health data:

1. Click the **"Import Data"** button on the Dashboard
2. Select the `sample-health-data.json` file included in the project root
3. The sample data will be imported and displayed

## Usage Guide

### Dashboard (Home Screen)

The Dashboard provides:
- Quick action buttons (Import, Add Event, View Timeline, Export)
- Statistics summary (total events, milestones, date range)
- Recent events preview (last 3 events)
- Category breakdown

### Timeline Screen

View all your health events in chronological order:
- Events grouped by month and year
- Visual timeline with connecting lines
- Color-coded dots (blue for regular events, pink for milestones)
- Edit or delete buttons on each event card
- Click any event to view full details

### Adding an Event

1. Click **"Add Event"** from Dashboard or Timeline
2. Fill in the event form:
   - **Date**: Use the calendar picker
   - **Title**: Brief description (required)
   - **Category**: Choose from predefined categories
   - **Description**: Detailed information
   - **Milestone**: Check if this is an important event
   - **Tags**: Add comma-separated tags
   - **Notes**: Additional information
3. Click **"Save Event"**

### Editing an Event

1. Click the edit button (pencil icon) on any event card
2. Modify the fields as needed
3. Click **"Save Event"**

### Viewing Event Details

Click on any event card to see:
- Full event information
- All tags and notes
- Creation and update timestamps
- Edit and delete options

### Exporting Data

1. Click **"Export Data"** from Dashboard or Timeline
2. A JSON file will be downloaded with all your health events
3. Save this file as a backup or to transfer to another device

### Importing Data

1. Click **"Import Data"** from Dashboard
2. Select a JSON file from your computer
3. The app will validate and import the events
4. Duplicate events (by ID) will be skipped

## JSON Data Format

The app accepts JSON files in the following format:

```json
{
  "events": [
    {
      "id": "unique_id",
      "date": "2025-01-15",
      "title": "Event Title",
      "description": "Event description",
      "category": "Appointment",
      "isMilestone": false,
      "tags": ["tag1", "tag2"],
      "notes": "Additional notes",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "exportDate": "2025-01-09T00:00:00Z",
  "version": "1.0"
}
```

### Simplified Format

The app also accepts a simple array of events:

```json
[
  {
    "date": "2025-01-15",
    "title": "Event Title",
    "description": "Event description",
    "category": "Appointment",
    "isMilestone": false
  }
]
```

## Categories

Predefined event categories:
- Appointment
- Medication
- Symptom
- Test
- Procedure
- Vaccination
- Emergency
- Follow-up
- Other

## Technology Stack

- **React 18.3.1**: UI framework
- **TypeScript 5.5.3**: Type safety
- **Vite 5.4.2**: Build tool and dev server
- **React Router DOM**: Navigation
- **Lucide React**: Icon library
- **Tailwind CSS 3.4.1**: Utility-first styling (base styles)
- **localStorage**: Client-side data persistence

## Browser Support

Works in all modern browsers that support:
- ES6+
- localStorage
- HTML5 date input
- CSS Grid and Flexbox

## Data Privacy

- All data is stored locally in your browser
- No data is sent to any server
- Export your data regularly for backups
- Clearing browser data will delete your health events

## Tips

1. **Regular Backups**: Export your data monthly using the Export button
2. **Use Milestones**: Mark important events (diagnoses, surgeries, etc.) as milestones
3. **Add Tags**: Use tags to organize related events (e.g., "cardiology", "follow-up")
4. **Detailed Notes**: Include medication dosages, test results, and doctor recommendations
5. **Date Accuracy**: Use the calendar picker to ensure dates are correct

## Troubleshooting

### Events Not Appearing
- Check that the date format is correct (YYYY-MM-DD)
- Verify the event was saved (look for success message)
- Try refreshing the page

### Import Failed
- Ensure your JSON file is valid
- Check that required fields (date, title) are present
- Look at the error message for specific issues

### Data Lost
- Check browser localStorage limits (typically 5-10MB)
- Restore from your most recent export file
- Ensure you're using the same browser and not in private/incognito mode

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or questions, please create an issue in the project repository.
