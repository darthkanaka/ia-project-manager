// Core entity types for Project Management System

// ============================================
// Team Member Types
// ============================================
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: TeamRole;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TeamRole = 'admin' | 'manager' | 'member' | 'viewer';

// ============================================
// Client Types
// ============================================
export interface Client {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  logo?: string;
  status: ClientStatus;
  teamMembers: string[]; // TeamMember IDs with access
  projects: Project[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export type ClientStatus = 'active' | 'inactive' | 'archived';

// ============================================
// Internal Spaces Types
// ============================================
export interface InternalSpace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  teamMembers: string[]; // TeamMember IDs with access
  projects: Project[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Project Types
// ============================================
export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string; // null for internal projects
  internalSpaceId?: string; // for internal projects
  status: ProjectStatus;
  priority: Priority;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  teamMembers: string[]; // TeamMember IDs
  tasks: Task[];
  events: Event[];
  lists: List[];
  notes: Note[];
  tags: string[];
  createdBy: string; // TeamMember ID
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================
// Task Types
// ============================================
export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  listId?: string;
  status: TaskStatus;
  priority: Priority;
  assignees: string[]; // TeamMember IDs
  dueDate?: Date;
  dueTime?: string; // HH:mm format
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  notes: Note[];
  subtasks: Subtask[];
  dependencies: string[]; // Task IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'on-hold' | 'urgent' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

// ============================================
// Event Types
// ============================================
export interface Event {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  clientId?: string;
  internalSpaceId?: string;
  type: EventType;
  startDate: Date;
  startTime: string; // HH:mm format
  endDate: Date;
  endTime: string; // HH:mm format
  allDay: boolean;
  location?: string;
  meetingLink?: string;
  attendees: EventAttendee[];
  visibility: EventVisibility;
  recurrence?: EventRecurrence;
  reminders: EventReminder[];
  notes: Note[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventType = 'meeting' | 'call' | 'deadline' | 'milestone' | 'reminder' | 'other';

export interface EventAttendee {
  id: string;
  teamMemberId?: string;
  externalEmail?: string;
  name: string;
  status: AttendeeStatus;
  canViewDetails: boolean;
  notified: boolean;
}

export type AttendeeStatus = 'pending' | 'accepted' | 'declined' | 'tentative';
export type EventVisibility = 'public' | 'private' | 'team-only';

export interface EventRecurrence {
  pattern: RecurrencePattern;
  interval: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[]; // 0-6 for weekly
  dayOfMonth?: number; // for monthly
}

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface EventReminder {
  id: string;
  type: ReminderType;
  time: number; // minutes before event
  sent: boolean;
}

export type ReminderType = 'email' | 'push' | 'in-app';

// ============================================
// List Types
// ============================================
export interface List {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  color?: string;
  icon?: string;
  order: number;
  tasks: Task[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Note Types
// ============================================
export interface Note {
  id: string;
  content: string;
  authorId: string;
  parentType: NoteParentType;
  parentId: string;
  mentions: Mention[];
  attachments: Attachment[];
  replies: Reply[];
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteParentType = 'client' | 'project' | 'task' | 'event' | 'internal-space';

export interface Mention {
  id: string;
  teamMemberId: string;
  startIndex: number;
  endIndex: number;
  notified: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  authorId: string;
  noteId: string;
  mentions: Mention[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Notification Types
// ============================================
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'mention'
  | 'task-assigned'
  | 'task-due'
  | 'task-completed'
  | 'event-invite'
  | 'event-reminder'
  | 'event-updated'
  | 'note-reply'
  | 'project-update'
  | 'system';

// ============================================
// View Types
// ============================================
export type ViewType = 'timeline' | 'calendar' | 'list';
export type TimelineGrouping = 'day' | 'week' | 'month';
export type CalendarView = 'month' | 'week' | 'day';

// ============================================
// Filter Types
// ============================================
export interface FilterState {
  search: string;
  status: TaskStatus[];
  priority: Priority[];
  assignees: string[];
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  showCompleted: boolean;
}

// ============================================
// Sort Types
// ============================================
export interface SortState {
  field: SortField;
  direction: 'asc' | 'desc';
}

export type SortField = 'title' | 'dueDate' | 'priority' | 'status' | 'createdAt' | 'updatedAt';

// ============================================
// App State Types
// ============================================
export interface AppState {
  currentUser: TeamMember | null;
  teamMembers: TeamMember[];
  clients: Client[];
  internalSpaces: InternalSpace[];
  notifications: Notification[];
  selectedClientId: string | null;
  selectedProjectId: string | null;
  selectedView: ViewType;
  filters: FilterState;
  sort: SortState;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Form Types
// ============================================
export interface TaskFormData {
  title: string;
  description?: string;
  projectId: string;
  listId?: string;
  status: TaskStatus;
  priority: Priority;
  assignees: string[];
  dueDate?: string;
  dueTime?: string;
  tags: string[];
}

export interface EventFormData {
  title: string;
  description?: string;
  projectId?: string;
  type: EventType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  meetingLink?: string;
  attendees: string[];
  visibility: EventVisibility;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  clientId?: string;
  internalSpaceId?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  teamMembers: string[];
  tags: string[];
}

export interface ClientFormData {
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  status: ClientStatus;
  teamMembers: string[];
}

export interface ListFormData {
  name: string;
  description?: string;
  projectId: string;
  color?: string;
  icon?: string;
}
