# Project Management System

A modern, full-featured project management application built with React, TypeScript, and Tailwind CSS. This application provides comprehensive tools for managing clients, projects, tasks, events, and team collaboration.

## Features

### Core Functionality
- **Client Management**: Organize work by clients with contact info, notes, and team access control
- **Project Management**: Create and track projects within clients or internal spaces
- **Task Management**: Full task lifecycle with statuses (To Do, In Progress, Blocked, On Hold, Urgent, Completed)
- **Event Management**: Schedule meetings, calls, deadlines, and milestones
- **Internal Spaces**: Organize internal projects outside of client work

### Views
- **Timeline View**: See tasks and events organized by date with relative date headers
- **Calendar View**: Month-based calendar with task and event visualization
- **List View**: Sortable, filterable task list with grouping options

### Collaboration
- **@Mentions**: Tag team members in notes and descriptions
- **Team Assignment**: Assign multiple team members to tasks and events
- **Notifications**: Real-time notification system for mentions, assignments, and due dates
- **Notes & Comments**: Threaded discussions on clients, projects, tasks, and events

### Additional Features
- **Subtasks**: Break down tasks into smaller, trackable items
- **Tags**: Organize and filter by custom tags
- **Priority Levels**: Low, Medium, High, Urgent
- **Due Dates & Times**: Track deadlines with time-specific due dates
- **Event Attendees**: Track attendance status for meetings

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API with useReducer

## Project Structure

```
src/
├── components/
│   ├── layout/           # Sidebar, Header components
│   ├── modals/           # Task, Event, Project, Client modals
│   ├── shared/           # Reusable UI components (Button, Badge, Avatar, etc.)
│   └── views/            # Timeline, Calendar, List, Client views
├── context/
│   └── AppContext.tsx    # Global state management
├── data/
│   └── sampleData.ts     # Sample data generators for development
├── services/
│   └── api.ts            # Service layer stubs for backend integration
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── date.ts           # Date formatting and manipulation
│   ├── helpers.ts        # General utility functions
│   └── status.ts         # Status configuration and helpers
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## Backend Integration

The application includes a complete service layer (`src/services/api.ts`) with stubs for all API operations. To integrate with a backend:

### Supabase Integration (Recommended)

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create `src/services/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   export const supabase = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.VITE_SUPABASE_ANON_KEY!
   )
   ```

3. Replace stub implementations in `src/services/api.ts` with Supabase queries

### Database Schema

The types in `src/types/index.ts` correspond to the following database tables:
- `team_members` - User profiles and roles
- `clients` - Client organizations
- `internal_spaces` - Internal project spaces
- `projects` - Projects (linked to clients or spaces)
- `tasks` - Tasks within projects
- `events` - Calendar events
- `lists` - Kanban-style lists within projects
- `notes` - Threaded notes/comments
- `notifications` - User notifications

See the Technical Specification document for complete database schema with RLS policies.

## Key Components

### Shared Components
- `Avatar` / `AvatarGroup` - User avatar display
- `Badge` - Status and priority badges
- `Button` / `IconButton` - Action buttons
- `Dropdown` / `MultiSelect` - Selection components
- `Modal` - Dialog wrapper
- `MentionTextarea` - Text input with @mention support
- `SearchInput` - Search field with clear button
- `Tabs` - Tab navigation
- `EmptyState` - Empty state placeholder

### View Components
- `TimelineView` - Date-grouped task/event timeline
- `CalendarView` - Monthly calendar grid
- `ListView` - Sortable, filterable task list
- `ClientView` - Client detail page with tabs

### Modal Components
- `TaskModal` - Create/edit tasks
- `EventModal` - Create/edit events
- `ProjectModal` - Create/edit projects
- `ClientModal` - Create/edit clients

## Configuration

### Environment Variables

Create a `.env` file for backend configuration:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Tailwind Configuration

Tailwind CSS v4 is configured via the Vite plugin in `vite.config.ts`. Custom styles are defined in `src/index.css`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## License

MIT
