import type {
  TeamMember,
  Client,
  InternalSpace,
  Project,
  Task,
  Event,
  List,
  Note,
  Notification,
} from '../types';
import { addDays, subDays } from '../utils/date';

// ============================================
// Sample Team Members
// ============================================

export const sampleTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    avatar: undefined,
    role: 'admin',
    department: 'Engineering',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'tm-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: undefined,
    role: 'manager',
    department: 'Design',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'tm-3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    avatar: undefined,
    role: 'member',
    department: 'Engineering',
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'tm-4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    avatar: undefined,
    role: 'member',
    department: 'Marketing',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'tm-5',
    name: 'David Kim',
    email: 'david.kim@company.com',
    avatar: undefined,
    role: 'member',
    department: 'Engineering',
    isActive: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
];

// ============================================
// Sample Notes
// ============================================

function createSampleNote(
  id: string,
  content: string,
  authorId: string,
  parentType: 'client' | 'project' | 'task' | 'event' | 'internal-space',
  parentId: string
): Note {
  return {
    id,
    content,
    authorId,
    parentType,
    parentId,
    mentions: [],
    attachments: [],
    replies: [],
    isPinned: false,
    isPrivate: false,
    createdAt: subDays(new Date(), Math.floor(Math.random() * 30)),
    updatedAt: subDays(new Date(), Math.floor(Math.random() * 10)),
  };
}

// ============================================
// Sample Tasks
// ============================================

function createSampleTasks(projectId: string): Task[] {
  const now = new Date();
  return [
    {
      id: `task-${projectId}-1`,
      title: 'Design system setup',
      description: 'Set up the design system with color palette, typography, and spacing',
      projectId,
      listId: undefined,
      status: 'completed',
      priority: 'high',
      assignees: ['tm-2'],
      dueDate: subDays(now, 5),
      dueTime: '17:00',
      completedAt: subDays(now, 6),
      estimatedHours: 8,
      actualHours: 10,
      tags: ['design', 'foundation'],
      notes: [],
      subtasks: [
        { id: 'st-1', title: 'Define color palette', completed: true, completedAt: subDays(now, 7), completedBy: 'tm-2' },
        { id: 'st-2', title: 'Set up typography scale', completed: true, completedAt: subDays(now, 6), completedBy: 'tm-2' },
      ],
      dependencies: [],
      createdBy: 'tm-1',
      createdAt: subDays(now, 14),
      updatedAt: subDays(now, 6),
    },
    {
      id: `task-${projectId}-2`,
      title: 'API integration',
      description: 'Integrate backend APIs with frontend components',
      projectId,
      listId: undefined,
      status: 'in-progress',
      priority: 'high',
      assignees: ['tm-3', 'tm-5'],
      dueDate: addDays(now, 3),
      dueTime: '18:00',
      completedAt: undefined,
      estimatedHours: 16,
      actualHours: undefined,
      tags: ['development', 'api'],
      notes: [createSampleNote('note-task-1', 'Need to coordinate with backend team on the auth endpoints', 'tm-3', 'task', `task-${projectId}-2`)],
      subtasks: [
        { id: 'st-3', title: 'Set up API client', completed: true, completedAt: subDays(now, 1), completedBy: 'tm-3' },
        { id: 'st-4', title: 'Implement auth endpoints', completed: false },
        { id: 'st-5', title: 'Implement data fetching', completed: false },
      ],
      dependencies: [],
      createdBy: 'tm-1',
      createdAt: subDays(now, 7),
      updatedAt: subDays(now, 1),
    },
    {
      id: `task-${projectId}-3`,
      title: 'User testing preparation',
      description: 'Prepare materials and scenarios for user testing sessions',
      projectId,
      listId: undefined,
      status: 'todo',
      priority: 'medium',
      assignees: ['tm-4'],
      dueDate: addDays(now, 7),
      dueTime: '12:00',
      completedAt: undefined,
      estimatedHours: 4,
      actualHours: undefined,
      tags: ['testing', 'ux'],
      notes: [],
      subtasks: [],
      dependencies: [`task-${projectId}-2`],
      createdBy: 'tm-2',
      createdAt: subDays(now, 3),
      updatedAt: subDays(now, 3),
    },
    {
      id: `task-${projectId}-4`,
      title: 'Performance optimization',
      description: 'Optimize bundle size and loading performance',
      projectId,
      listId: undefined,
      status: 'blocked',
      priority: 'medium',
      assignees: ['tm-5'],
      dueDate: addDays(now, 10),
      dueTime: '17:00',
      completedAt: undefined,
      estimatedHours: 12,
      actualHours: undefined,
      tags: ['performance', 'optimization'],
      notes: [createSampleNote('note-task-2', 'Blocked by API integration - need final endpoints to measure', 'tm-5', 'task', `task-${projectId}-4`)],
      subtasks: [],
      dependencies: [`task-${projectId}-2`],
      createdBy: 'tm-1',
      createdAt: subDays(now, 5),
      updatedAt: subDays(now, 2),
    },
    {
      id: `task-${projectId}-5`,
      title: 'Security audit',
      description: 'Review code for security vulnerabilities',
      projectId,
      listId: undefined,
      status: 'urgent',
      priority: 'urgent',
      assignees: ['tm-1', 'tm-3'],
      dueDate: addDays(now, 1),
      dueTime: '18:00',
      completedAt: undefined,
      estimatedHours: 8,
      actualHours: undefined,
      tags: ['security', 'audit'],
      notes: [],
      subtasks: [
        { id: 'st-6', title: 'Review authentication flow', completed: false },
        { id: 'st-7', title: 'Check for XSS vulnerabilities', completed: false },
        { id: 'st-8', title: 'Audit API endpoints', completed: false },
      ],
      dependencies: [],
      createdBy: 'tm-1',
      createdAt: subDays(now, 1),
      updatedAt: subDays(now, 1),
    },
  ];
}

// ============================================
// Sample Events
// ============================================

function createSampleEvents(projectId: string): Event[] {
  const now = new Date();
  return [
    {
      id: `event-${projectId}-1`,
      title: 'Sprint Planning',
      description: 'Plan tasks for the upcoming sprint',
      projectId,
      clientId: undefined,
      internalSpaceId: undefined,
      type: 'meeting',
      startDate: addDays(now, 1),
      startTime: '10:00',
      endDate: addDays(now, 1),
      endTime: '11:30',
      allDay: false,
      location: 'Conference Room A',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      attendees: [
        { id: 'att-1', teamMemberId: 'tm-1', name: 'Alex Johnson', status: 'accepted', canViewDetails: true, notified: true },
        { id: 'att-2', teamMemberId: 'tm-2', name: 'Sarah Chen', status: 'accepted', canViewDetails: true, notified: true },
        { id: 'att-3', teamMemberId: 'tm-3', name: 'Mike Wilson', status: 'pending', canViewDetails: true, notified: true },
      ],
      visibility: 'team-only',
      recurrence: { pattern: 'weekly', interval: 2 },
      reminders: [{ id: 'rem-1', type: 'in-app', time: 15, sent: false }],
      notes: [],
      createdBy: 'tm-1',
      createdAt: subDays(now, 7),
      updatedAt: subDays(now, 7),
    },
    {
      id: `event-${projectId}-2`,
      title: 'Design Review',
      description: 'Review latest design iterations',
      projectId,
      clientId: undefined,
      internalSpaceId: undefined,
      type: 'meeting',
      startDate: addDays(now, 3),
      startTime: '14:00',
      endDate: addDays(now, 3),
      endTime: '15:00',
      allDay: false,
      location: undefined,
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      attendees: [
        { id: 'att-4', teamMemberId: 'tm-2', name: 'Sarah Chen', status: 'accepted', canViewDetails: true, notified: true },
        { id: 'att-5', teamMemberId: 'tm-4', name: 'Emily Davis', status: 'tentative', canViewDetails: true, notified: true },
      ],
      visibility: 'public',
      recurrence: undefined,
      reminders: [{ id: 'rem-2', type: 'email', time: 60, sent: false }],
      notes: [],
      createdBy: 'tm-2',
      createdAt: subDays(now, 3),
      updatedAt: subDays(now, 3),
    },
    {
      id: `event-${projectId}-3`,
      title: 'Project Deadline',
      description: 'Final delivery deadline',
      projectId,
      clientId: undefined,
      internalSpaceId: undefined,
      type: 'deadline',
      startDate: addDays(now, 14),
      startTime: '18:00',
      endDate: addDays(now, 14),
      endTime: '18:00',
      allDay: false,
      location: undefined,
      meetingLink: undefined,
      attendees: [],
      visibility: 'public',
      recurrence: undefined,
      reminders: [
        { id: 'rem-3', type: 'in-app', time: 1440, sent: false },
        { id: 'rem-4', type: 'email', time: 4320, sent: false },
      ],
      notes: [],
      createdBy: 'tm-1',
      createdAt: subDays(now, 14),
      updatedAt: subDays(now, 14),
    },
  ];
}

// ============================================
// Sample Lists
// ============================================

function createSampleLists(projectId: string): List[] {
  return [
    {
      id: `list-${projectId}-1`,
      name: 'Backlog',
      description: 'Tasks to be worked on',
      projectId,
      color: '#6B7280',
      icon: 'inbox',
      order: 0,
      tasks: [],
      createdBy: 'tm-1',
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 30),
    },
    {
      id: `list-${projectId}-2`,
      name: 'In Progress',
      description: 'Currently being worked on',
      projectId,
      color: '#3B82F6',
      icon: 'play',
      order: 1,
      tasks: [],
      createdBy: 'tm-1',
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 30),
    },
    {
      id: `list-${projectId}-3`,
      name: 'Review',
      description: 'Ready for review',
      projectId,
      color: '#F59E0B',
      icon: 'eye',
      order: 2,
      tasks: [],
      createdBy: 'tm-1',
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 30),
    },
    {
      id: `list-${projectId}-4`,
      name: 'Done',
      description: 'Completed tasks',
      projectId,
      color: '#10B981',
      icon: 'check',
      order: 3,
      tasks: [],
      createdBy: 'tm-1',
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 30),
    },
  ];
}

// ============================================
// Sample Projects
// ============================================

function createSampleProject(
  id: string,
  name: string,
  clientId: string | undefined,
  internalSpaceId: string | undefined
): Project {
  const now = new Date();
  return {
    id,
    name,
    description: `Description for ${name}`,
    clientId,
    internalSpaceId,
    status: 'active',
    priority: 'high',
    startDate: subDays(now, 30),
    dueDate: addDays(now, 30),
    completedAt: undefined,
    teamMembers: ['tm-1', 'tm-2', 'tm-3'],
    tasks: createSampleTasks(id),
    events: createSampleEvents(id),
    lists: createSampleLists(id),
    notes: [createSampleNote(`note-proj-${id}`, 'Project kickoff notes - all team members aligned on goals', 'tm-1', 'project', id)],
    tags: ['web', 'frontend'],
    createdBy: 'tm-1',
    createdAt: subDays(now, 30),
    updatedAt: subDays(now, 1),
  };
}

// ============================================
// Sample Clients
// ============================================

export const sampleClients: Client[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    contactEmail: 'contact@acme.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
    website: 'https://acme.com',
    logo: undefined,
    status: 'active',
    teamMembers: ['tm-1', 'tm-2', 'tm-3'],
    projects: [createSampleProject('proj-1', 'Website Redesign', 'client-1', undefined)],
    notes: [createSampleNote('note-client-1', 'Key stakeholder: John Smith (CEO)', 'tm-1', 'client', 'client-1')],
    createdAt: subDays(new Date(), 90),
    updatedAt: subDays(new Date(), 5),
  },
  {
    id: 'client-2',
    name: 'TechStart Inc',
    contactEmail: 'hello@techstart.io',
    contactPhone: '+1 (555) 987-6543',
    address: '456 Innovation Blvd, Austin, TX 78701',
    website: 'https://techstart.io',
    logo: undefined,
    status: 'active',
    teamMembers: ['tm-1', 'tm-4', 'tm-5'],
    projects: [createSampleProject('proj-2', 'Mobile App Development', 'client-2', undefined)],
    notes: [],
    createdAt: subDays(new Date(), 60),
    updatedAt: subDays(new Date(), 2),
  },
  {
    id: 'client-3',
    name: 'Global Services Ltd',
    contactEmail: 'info@globalservices.com',
    contactPhone: '+1 (555) 456-7890',
    address: '789 Enterprise Way, New York, NY 10001',
    website: 'https://globalservices.com',
    logo: undefined,
    status: 'inactive',
    teamMembers: ['tm-2'],
    projects: [],
    notes: [createSampleNote('note-client-3', 'Client on hold - budget review in progress', 'tm-2', 'client', 'client-3')],
    createdAt: subDays(new Date(), 120),
    updatedAt: subDays(new Date(), 30),
  },
];

// ============================================
// Sample Internal Spaces
// ============================================

export const sampleInternalSpaces: InternalSpace[] = [
  {
    id: 'space-1',
    name: 'Engineering',
    description: 'Internal engineering projects and initiatives',
    icon: 'code',
    color: '#3B82F6',
    teamMembers: ['tm-1', 'tm-3', 'tm-5'],
    projects: [createSampleProject('proj-3', 'Infrastructure Upgrade', undefined, 'space-1')],
    notes: [],
    createdAt: subDays(new Date(), 180),
    updatedAt: subDays(new Date(), 7),
  },
  {
    id: 'space-2',
    name: 'Marketing',
    description: 'Marketing campaigns and content',
    icon: 'megaphone',
    color: '#EC4899',
    teamMembers: ['tm-2', 'tm-4'],
    projects: [createSampleProject('proj-4', 'Q1 Marketing Campaign', undefined, 'space-2')],
    notes: [],
    createdAt: subDays(new Date(), 150),
    updatedAt: subDays(new Date(), 3),
  },
  {
    id: 'space-3',
    name: 'HR & Operations',
    description: 'Human resources and operational initiatives',
    icon: 'users',
    color: '#10B981',
    teamMembers: ['tm-1', 'tm-2'],
    projects: [],
    notes: [],
    createdAt: subDays(new Date(), 180),
    updatedAt: subDays(new Date(), 14),
  },
];

// ============================================
// Sample Notifications
// ============================================

export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'tm-1',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Sarah Chen mentioned you in a note on Website Redesign',
    link: '/projects/proj-1',
    relatedEntityType: 'project',
    relatedEntityId: 'proj-1',
    isRead: false,
    createdAt: subDays(new Date(), 0.1),
  },
  {
    id: 'notif-2',
    userId: 'tm-1',
    type: 'task-due',
    title: 'Task due soon',
    message: 'Security audit is due tomorrow',
    link: '/tasks/task-proj-1-5',
    relatedEntityType: 'task',
    relatedEntityId: 'task-proj-1-5',
    isRead: false,
    createdAt: subDays(new Date(), 0.5),
  },
  {
    id: 'notif-3',
    userId: 'tm-1',
    type: 'event-reminder',
    title: 'Upcoming event',
    message: 'Sprint Planning starts in 1 hour',
    link: '/events/event-proj-1-1',
    relatedEntityType: 'event',
    relatedEntityId: 'event-proj-1-1',
    isRead: true,
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'notif-4',
    userId: 'tm-1',
    type: 'task-completed',
    title: 'Task completed',
    message: 'Mike Wilson completed Design system setup',
    link: '/tasks/task-proj-1-1',
    relatedEntityType: 'task',
    relatedEntityId: 'task-proj-1-1',
    isRead: true,
    createdAt: subDays(new Date(), 2),
  },
];

// ============================================
// Export all sample data
// ============================================

export const sampleData = {
  teamMembers: sampleTeamMembers,
  clients: sampleClients,
  internalSpaces: sampleInternalSpaces,
  notifications: sampleNotifications,
};

// Helper to get current user (for demo)
export function getCurrentUser(): TeamMember {
  return sampleTeamMembers[0];
}

// Helper to get all projects
export function getAllProjects(): Project[] {
  const clientProjects = sampleClients.flatMap((c) => c.projects);
  const internalProjects = sampleInternalSpaces.flatMap((s) => s.projects);
  return [...clientProjects, ...internalProjects];
}

// Helper to get all tasks
export function getAllTasks(): Task[] {
  return getAllProjects().flatMap((p) => p.tasks);
}

// Helper to get all events
export function getAllEvents(): Event[] {
  return getAllProjects().flatMap((p) => p.events);
}
