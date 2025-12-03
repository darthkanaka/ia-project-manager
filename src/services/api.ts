/**
 * API Service Layer
 *
 * This module provides stubs for all API operations that will eventually
 * connect to Supabase. Currently returns mock data for development.
 *
 * When integrating with Supabase:
 * 1. Install @supabase/supabase-js
 * 2. Create a Supabase client in src/services/supabase.ts
 * 3. Replace the stub implementations below with actual Supabase queries
 */

import type {
  ApiResponse,
  PaginatedResponse,
  TeamMember,
  Client,
  Project,
  Task,
  Event,
  Notification,
  ClientFormData,
  ProjectFormData,
  TaskFormData,
  EventFormData,
} from '../types';

// Simulate network delay for development
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to create API responses
function createResponse<T>(data: T): ApiResponse<T> {
  return { data, error: null, status: 200 };
}

function createErrorResponse<T>(message: string, code: string = 'ERROR'): ApiResponse<T> {
  return {
    data: null,
    error: { code, message },
    status: 400,
  };
}

// ============================================
// Authentication
// ============================================

export const authService = {
  /**
   * Sign in with email and password
   * TODO: Implement with Supabase Auth
   */
  async signIn(email: string, _password: string): Promise<ApiResponse<{ user: TeamMember; token: string }>> {
    await delay(500);
    console.log('Auth stub: signIn', { email });
    return createErrorResponse('Authentication not implemented');
  },

  /**
   * Sign out the current user
   * TODO: Implement with Supabase Auth
   */
  async signOut(): Promise<ApiResponse<void>> {
    await delay(200);
    console.log('Auth stub: signOut');
    return createResponse(undefined);
  },

  /**
   * Get current authenticated user
   * TODO: Implement with Supabase Auth
   */
  async getCurrentUser(): Promise<ApiResponse<TeamMember | null>> {
    await delay(200);
    console.log('Auth stub: getCurrentUser');
    return createResponse(null);
  },
};

// ============================================
// Team Members
// ============================================

export const teamService = {
  /**
   * Get all team members
   * TODO: Implement with Supabase query
   */
  async getAll(): Promise<ApiResponse<TeamMember[]>> {
    await delay(300);
    console.log('Team stub: getAll');
    return createResponse([]);
  },

  /**
   * Get team member by ID
   * TODO: Implement with Supabase query
   */
  async getById(id: string): Promise<ApiResponse<TeamMember | null>> {
    await delay(200);
    console.log('Team stub: getById', { id });
    return createResponse(null);
  },

  /**
   * Update team member
   * TODO: Implement with Supabase mutation
   */
  async update(id: string, data: Partial<TeamMember>): Promise<ApiResponse<TeamMember>> {
    await delay(300);
    console.log('Team stub: update', { id, data });
    return createErrorResponse('Not implemented');
  },
};

// ============================================
// Clients
// ============================================

export const clientService = {
  /**
   * Get all clients (with RLS applied)
   * TODO: Implement with Supabase query
   */
  async getAll(): Promise<ApiResponse<Client[]>> {
    await delay(300);
    console.log('Client stub: getAll');
    return createResponse([]);
  },

  /**
   * Get paginated clients
   * TODO: Implement with Supabase query
   */
  async getPaginated(page: number, pageSize: number): Promise<PaginatedResponse<Client>> {
    await delay(300);
    console.log('Client stub: getPaginated', { page, pageSize });
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  },

  /**
   * Get client by ID
   * TODO: Implement with Supabase query
   */
  async getById(id: string): Promise<ApiResponse<Client | null>> {
    await delay(200);
    console.log('Client stub: getById', { id });
    return createResponse(null);
  },

  /**
   * Create new client
   * TODO: Implement with Supabase insert
   */
  async create(data: ClientFormData): Promise<ApiResponse<Client>> {
    await delay(400);
    console.log('Client stub: create', { data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update client
   * TODO: Implement with Supabase update
   */
  async update(id: string, data: ClientFormData): Promise<ApiResponse<Client>> {
    await delay(400);
    console.log('Client stub: update', { id, data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Delete client
   * TODO: Implement with Supabase delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Client stub: delete', { id });
    return createErrorResponse('Not implemented');
  },
};

// ============================================
// Projects
// ============================================

export const projectService = {
  /**
   * Get all projects
   * TODO: Implement with Supabase query
   */
  async getAll(): Promise<ApiResponse<Project[]>> {
    await delay(300);
    console.log('Project stub: getAll');
    return createResponse([]);
  },

  /**
   * Get projects by client ID
   * TODO: Implement with Supabase query
   */
  async getByClientId(clientId: string): Promise<ApiResponse<Project[]>> {
    await delay(300);
    console.log('Project stub: getByClientId', { clientId });
    return createResponse([]);
  },

  /**
   * Get project by ID
   * TODO: Implement with Supabase query
   */
  async getById(id: string): Promise<ApiResponse<Project | null>> {
    await delay(200);
    console.log('Project stub: getById', { id });
    return createResponse(null);
  },

  /**
   * Create new project
   * TODO: Implement with Supabase insert
   */
  async create(data: ProjectFormData): Promise<ApiResponse<Project>> {
    await delay(400);
    console.log('Project stub: create', { data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update project
   * TODO: Implement with Supabase update
   */
  async update(id: string, data: ProjectFormData): Promise<ApiResponse<Project>> {
    await delay(400);
    console.log('Project stub: update', { id, data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Delete project
   * TODO: Implement with Supabase delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Project stub: delete', { id });
    return createErrorResponse('Not implemented');
  },
};

// ============================================
// Tasks
// ============================================

export const taskService = {
  /**
   * Get tasks by project ID
   * TODO: Implement with Supabase query
   */
  async getByProjectId(projectId: string): Promise<ApiResponse<Task[]>> {
    await delay(300);
    console.log('Task stub: getByProjectId', { projectId });
    return createResponse([]);
  },

  /**
   * Get all tasks (for current user)
   * TODO: Implement with Supabase query
   */
  async getMyTasks(): Promise<ApiResponse<Task[]>> {
    await delay(300);
    console.log('Task stub: getMyTasks');
    return createResponse([]);
  },

  /**
   * Get task by ID
   * TODO: Implement with Supabase query
   */
  async getById(id: string): Promise<ApiResponse<Task | null>> {
    await delay(200);
    console.log('Task stub: getById', { id });
    return createResponse(null);
  },

  /**
   * Create new task
   * TODO: Implement with Supabase insert
   */
  async create(projectId: string, data: TaskFormData): Promise<ApiResponse<Task>> {
    await delay(400);
    console.log('Task stub: create', { projectId, data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update task
   * TODO: Implement with Supabase update
   */
  async update(id: string, data: Partial<TaskFormData>): Promise<ApiResponse<Task>> {
    await delay(400);
    console.log('Task stub: update', { id, data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update task status
   * TODO: Implement with Supabase update
   */
  async updateStatus(id: string, status: Task['status']): Promise<ApiResponse<Task>> {
    await delay(300);
    console.log('Task stub: updateStatus', { id, status });
    return createErrorResponse('Not implemented');
  },

  /**
   * Delete task
   * TODO: Implement with Supabase delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Task stub: delete', { id });
    return createErrorResponse('Not implemented');
  },
};

// ============================================
// Events
// ============================================

export const eventService = {
  /**
   * Get events by project ID
   * TODO: Implement with Supabase query
   */
  async getByProjectId(projectId: string): Promise<ApiResponse<Event[]>> {
    await delay(300);
    console.log('Event stub: getByProjectId', { projectId });
    return createResponse([]);
  },

  /**
   * Get events by date range
   * TODO: Implement with Supabase query
   */
  async getByDateRange(start: Date, end: Date): Promise<ApiResponse<Event[]>> {
    await delay(300);
    console.log('Event stub: getByDateRange', { start, end });
    return createResponse([]);
  },

  /**
   * Get event by ID
   * TODO: Implement with Supabase query
   */
  async getById(id: string): Promise<ApiResponse<Event | null>> {
    await delay(200);
    console.log('Event stub: getById', { id });
    return createResponse(null);
  },

  /**
   * Create new event
   * TODO: Implement with Supabase insert
   */
  async create(data: EventFormData): Promise<ApiResponse<Event>> {
    await delay(400);
    console.log('Event stub: create', { data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update event
   * TODO: Implement with Supabase update
   */
  async update(id: string, data: EventFormData): Promise<ApiResponse<Event>> {
    await delay(400);
    console.log('Event stub: update', { id, data });
    return createErrorResponse('Not implemented');
  },

  /**
   * Delete event
   * TODO: Implement with Supabase delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Event stub: delete', { id });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update attendee status
   * TODO: Implement with Supabase update
   */
  async updateAttendeeStatus(
    eventId: string,
    attendeeId: string,
    status: 'accepted' | 'declined' | 'tentative'
  ): Promise<ApiResponse<Event>> {
    await delay(300);
    console.log('Event stub: updateAttendeeStatus', { eventId, attendeeId, status });
    return createErrorResponse('Not implemented');
  },
};

// ============================================
// Notifications
// ============================================

export const notificationService = {
  /**
   * Get notifications for current user
   * TODO: Implement with Supabase query + realtime subscription
   */
  async getAll(): Promise<ApiResponse<Notification[]>> {
    await delay(300);
    console.log('Notification stub: getAll');
    return createResponse([]);
  },

  /**
   * Get unread count
   * TODO: Implement with Supabase query
   */
  async getUnreadCount(): Promise<ApiResponse<number>> {
    await delay(200);
    console.log('Notification stub: getUnreadCount');
    return createResponse(0);
  },

  /**
   * Mark notification as read
   * TODO: Implement with Supabase update
   */
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    await delay(200);
    console.log('Notification stub: markAsRead', { id });
    return createResponse(undefined);
  },

  /**
   * Mark all notifications as read
   * TODO: Implement with Supabase update
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Notification stub: markAllAsRead');
    return createResponse(undefined);
  },

  /**
   * Subscribe to real-time notifications
   * TODO: Implement with Supabase realtime
   */
  subscribe(_callback: (notification: Notification) => void): () => void {
    console.log('Notification stub: subscribe');
    // Return unsubscribe function
    return () => {
      console.log('Notification stub: unsubscribe');
    };
  },
};

// ============================================
// Notes
// ============================================

export const noteService = {
  /**
   * Get notes by parent
   * TODO: Implement with Supabase query
   */
  async getByParent(
    parentType: 'client' | 'project' | 'task' | 'event',
    parentId: string
  ): Promise<ApiResponse<import('../types').Note[]>> {
    await delay(300);
    console.log('Note stub: getByParent', { parentType, parentId });
    return createResponse([]);
  },

  /**
   * Create note
   * TODO: Implement with Supabase insert
   */
  async create(
    parentType: 'client' | 'project' | 'task' | 'event',
    parentId: string,
    content: string
  ): Promise<ApiResponse<import('../types').Note>> {
    await delay(400);
    console.log('Note stub: create', { parentType, parentId, content });
    return createErrorResponse('Not implemented');
  },

  /**
   * Update note
   * TODO: Implement with Supabase update
   */
  async update(id: string, content: string): Promise<ApiResponse<import('../types').Note>> {
    await delay(400);
    console.log('Note stub: update', { id, content });
    return createErrorResponse('Not implemented');
  },

  /**
   * Delete note
   * TODO: Implement with Supabase delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    console.log('Note stub: delete', { id });
    return createErrorResponse('Not implemented');
  },

  /**
   * Add reply to note
   * TODO: Implement with Supabase insert
   */
  async addReply(noteId: string, content: string): Promise<ApiResponse<import('../types').Reply>> {
    await delay(400);
    console.log('Note stub: addReply', { noteId, content });
    return createErrorResponse('Not implemented');
  },
};
