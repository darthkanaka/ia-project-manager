import type {
  TaskStatus,
  ProjectStatus,
  ClientStatus,
  Priority,
  EventType,
  AttendeeStatus,
} from '../types';

// ============================================
// Task Status Helpers
// ============================================

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: string }
> = {
  'todo': {
    label: 'To Do',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: 'circle',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: 'play-circle',
  },
  'blocked': {
    label: 'Blocked',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    icon: 'alert-circle',
  },
  'on-hold': {
    label: 'On Hold',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    icon: 'pause-circle',
  },
  'urgent': {
    label: 'Urgent',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    icon: 'alert-triangle',
  },
  'completed': {
    label: 'Completed',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: 'check-circle',
  },
};

export function getTaskStatusConfig(status: TaskStatus) {
  return TASK_STATUS_CONFIG[status];
}

export function getTaskStatusLabel(status: TaskStatus): string {
  return TASK_STATUS_CONFIG[status].label;
}

export function getTaskStatusColor(status: TaskStatus): string {
  return TASK_STATUS_CONFIG[status].color;
}

export function isTaskComplete(status: TaskStatus): boolean {
  return status === 'completed';
}

export function isTaskActive(status: TaskStatus): boolean {
  return status === 'in-progress' || status === 'urgent';
}

export function isTaskBlocked(status: TaskStatus): boolean {
  return status === 'blocked' || status === 'on-hold';
}

// ============================================
// Project Status Helpers
// ============================================

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string }
> = {
  'planning': {
    label: 'Planning',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  'active': {
    label: 'Active',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  'on-hold': {
    label: 'On Hold',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  'completed': {
    label: 'Completed',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  'archived': {
    label: 'Archived',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

export function getProjectStatusConfig(status: ProjectStatus) {
  return PROJECT_STATUS_CONFIG[status];
}

export function getProjectStatusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_CONFIG[status].label;
}

// ============================================
// Client Status Helpers
// ============================================

export const CLIENT_STATUS_CONFIG: Record<
  ClientStatus,
  { label: string; color: string; bgColor: string }
> = {
  'active': {
    label: 'Active',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  'inactive': {
    label: 'Inactive',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  'archived': {
    label: 'Archived',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export function getClientStatusConfig(status: ClientStatus) {
  return CLIENT_STATUS_CONFIG[status];
}

// ============================================
// Priority Helpers
// ============================================

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string; sortOrder: number }
> = {
  'low': {
    label: 'Low',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    sortOrder: 1,
  },
  'medium': {
    label: 'Medium',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    sortOrder: 2,
  },
  'high': {
    label: 'High',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    sortOrder: 3,
  },
  'urgent': {
    label: 'Urgent',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    sortOrder: 4,
  },
};

export function getPriorityConfig(priority: Priority) {
  return PRIORITY_CONFIG[priority];
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_CONFIG[priority].label;
}

export function comparePriority(a: Priority, b: Priority): number {
  return PRIORITY_CONFIG[b].sortOrder - PRIORITY_CONFIG[a].sortOrder;
}

// ============================================
// Event Type Helpers
// ============================================

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  'meeting': {
    label: 'Meeting',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: 'users',
  },
  'call': {
    label: 'Call',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'phone',
  },
  'deadline': {
    label: 'Deadline',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'clock',
  },
  'milestone': {
    label: 'Milestone',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: 'flag',
  },
  'reminder': {
    label: 'Reminder',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: 'bell',
  },
  'other': {
    label: 'Other',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: 'calendar',
  },
};

export function getEventTypeConfig(type: EventType) {
  return EVENT_TYPE_CONFIG[type];
}

// ============================================
// Attendee Status Helpers
// ============================================

export const ATTENDEE_STATUS_CONFIG: Record<
  AttendeeStatus,
  { label: string; color: string; icon: string }
> = {
  'pending': {
    label: 'Pending',
    color: 'text-gray-500',
    icon: 'clock',
  },
  'accepted': {
    label: 'Accepted',
    color: 'text-green-500',
    icon: 'check',
  },
  'declined': {
    label: 'Declined',
    color: 'text-red-500',
    icon: 'x',
  },
  'tentative': {
    label: 'Tentative',
    color: 'text-yellow-500',
    icon: 'help-circle',
  },
};

export function getAttendeeStatusConfig(status: AttendeeStatus) {
  return ATTENDEE_STATUS_CONFIG[status];
}
