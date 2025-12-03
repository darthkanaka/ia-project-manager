import type { TeamMember, Task, Event, Project, FilterState, SortState } from '../types';

// ============================================
// ID Generation
// ============================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

// ============================================
// String Helpers
// ============================================

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// Array Helpers
// ============================================

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// ============================================
// Object Helpers
// ============================================

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================
// Filter & Search Helpers
// ============================================

export function filterTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter((task) => {
    // Search filter
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    // Assignees filter
    if (
      filters.assignees.length > 0 &&
      !task.assignees.some((a) => filters.assignees.includes(a))
    ) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0 && !task.tags.some((t) => filters.tags.includes(t))) {
      return false;
    }

    // Completed filter
    if (!filters.showCompleted && task.status === 'completed') {
      return false;
    }

    // Date range filter
    if (filters.dateRange && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < filters.dateRange.start || dueDate > filters.dateRange.end) {
        return false;
      }
    }

    return true;
  });
}

export function filterEvents(events: Event[], filters: FilterState): Event[] {
  return events.filter((event) => {
    // Search filter
    if (
      filters.search &&
      !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !event.description?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const startDate = new Date(event.startDate);
      if (startDate < filters.dateRange.start || startDate > filters.dateRange.end) {
        return false;
      }
    }

    return true;
  });
}

export function sortTasks(tasks: Task[], sort: SortState): Task[] {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority': {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      }
      case 'status': {
        const statusOrder = {
          urgent: 6,
          'in-progress': 5,
          blocked: 4,
          'on-hold': 3,
          todo: 2,
          completed: 1,
        };
        comparison = statusOrder[b.status] - statusOrder[a.status];
        break;
      }
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

// ============================================
// Team Member Helpers
// ============================================

export function findTeamMember(members: TeamMember[], id: string): TeamMember | undefined {
  return members.find((m) => m.id === id);
}

export function getAssigneeNames(task: Task, members: TeamMember[]): string[] {
  return task.assignees
    .map((id) => findTeamMember(members, id)?.name)
    .filter((name): name is string => !!name);
}

// ============================================
// Project Helpers
// ============================================

export function getProjectProgress(project: Project): number {
  const totalTasks = project.tasks.length;
  if (totalTasks === 0) return 0;
  const completedTasks = project.tasks.filter((t) => t.status === 'completed').length;
  return Math.round((completedTasks / totalTasks) * 100);
}

export function getProjectTaskCounts(project: Project): Record<string, number> {
  return project.tasks.reduce(
    (counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );
}

// ============================================
// Mention Helpers
// ============================================

export function extractMentions(text: string): string[] {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[2]); // Extract the ID from (id)
  }
  return mentions;
}

export function replaceMentionsWithNames(text: string): string {
  return text.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
}

export function formatMentionText(
  text: string,
  members: TeamMember[]
): { text: string; mentions: { id: string; name: string; start: number; end: number }[] } {
  const mentions: { id: string; name: string; start: number; end: number }[] = [];
  let offset = 0;

  const formattedText = text.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, (match, name, id, index) => {
    const member = findTeamMember(members, id);
    const displayName = member?.name || name;
    const start = index - offset;
    const end = start + displayName.length + 1; // +1 for @
    mentions.push({ id, name: displayName, start, end });
    offset += match.length - (displayName.length + 1);
    return `@${displayName}`;
  });

  return { text: formattedText, mentions };
}

// ============================================
// Validation Helpers
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Color Helpers
// ============================================

export function getRandomColor(): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
  ];
  return colors[Math.abs(hash) % colors.length];
}

// ============================================
// Local Storage Helpers
// ============================================

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}
