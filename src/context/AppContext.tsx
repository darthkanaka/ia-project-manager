import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  TeamMember,
  Client,
  Project,
  Task,
  Event,
  Notification,
  ViewType,
  FilterState,
  SortState,
  TaskFormData,
  EventFormData,
  ProjectFormData,
  ClientFormData,
} from '../types';
import { sampleData, getCurrentUser } from '../data/sampleData';
import { generateId } from '../utils';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: TeamMember | null }
  | { type: 'SELECT_CLIENT'; payload: string | null }
  | { type: 'SELECT_PROJECT'; payload: string | null }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: SortState }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_PROJECT'; payload: { clientId?: string; spaceId?: string; project: Project } }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: { projectId: string; taskId: string } }
  | { type: 'ADD_EVENT'; payload: { projectId?: string; event: Event } }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: { projectId?: string; eventId: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification };

// Initial state
const initialState: AppState = {
  currentUser: getCurrentUser(),
  teamMembers: sampleData.teamMembers,
  clients: sampleData.clients,
  internalSpaces: sampleData.internalSpaces,
  notifications: sampleData.notifications,
  selectedClientId: null,
  selectedProjectId: null,
  selectedView: 'timeline',
  filters: {
    search: '',
    status: [],
    priority: [],
    assignees: [],
    tags: [],
    showCompleted: true,
  },
  sort: {
    field: 'dueDate',
    direction: 'asc',
  },
  sidebarCollapsed: false,
  isLoading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SELECT_CLIENT':
      return {
        ...state,
        selectedClientId: action.payload,
        selectedProjectId: null,
      };

    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };

    case 'SET_VIEW':
      return { ...state, selectedView: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'SET_SORT':
      return { ...state, sort: action.payload };

    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((c) => c.id !== action.payload),
        selectedClientId:
          state.selectedClientId === action.payload ? null : state.selectedClientId,
      };

    case 'ADD_PROJECT': {
      const { clientId, spaceId, project } = action.payload;
      if (clientId) {
        return {
          ...state,
          clients: state.clients.map((c) =>
            c.id === clientId ? { ...c, projects: [...c.projects, project] } : c
          ),
        };
      } else if (spaceId) {
        return {
          ...state,
          internalSpaces: state.internalSpaces.map((s) =>
            s.id === spaceId ? { ...s, projects: [...s.projects, project] } : s
          ),
        };
      }
      return state;
    }

    case 'UPDATE_PROJECT': {
      const updateProject = (projects: Project[]) =>
        projects.map((p) => (p.id === action.payload.id ? action.payload : p));

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProject(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProject(s.projects),
        })),
      };
    }

    case 'DELETE_PROJECT': {
      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: c.projects.filter((p) => p.id !== action.payload),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: s.projects.filter((p) => p.id !== action.payload),
        })),
        selectedProjectId:
          state.selectedProjectId === action.payload ? null : state.selectedProjectId,
      };
    }

    case 'ADD_TASK': {
      const { projectId, task } = action.payload;
      const updateProjects = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p
        );

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'UPDATE_TASK': {
      const updateTask = (tasks: Task[]) =>
        tasks.map((t) => (t.id === action.payload.id ? action.payload : t));
      const updateProjects = (projects: Project[]) =>
        projects.map((p) => ({ ...p, tasks: updateTask(p.tasks) }));

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'DELETE_TASK': {
      const { projectId, taskId } = action.payload;
      const updateProjects = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p
        );

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'ADD_EVENT': {
      const { projectId, event } = action.payload;
      if (!projectId) return state;

      const updateProjects = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId ? { ...p, events: [...p.events, event] } : p
        );

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'UPDATE_EVENT': {
      const updateEvent = (events: Event[]) =>
        events.map((e) => (e.id === action.payload.id ? action.payload : e));
      const updateProjects = (projects: Project[]) =>
        projects.map((p) => ({ ...p, events: updateEvent(p.events) }));

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'DELETE_EVENT': {
      const { projectId, eventId } = action.payload;
      if (!projectId) return state;

      const updateProjects = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId ? { ...p, events: p.events.filter((e) => e.id !== eventId) } : p
        );

      return {
        ...state,
        clients: state.clients.map((c) => ({
          ...c,
          projects: updateProjects(c.projects),
        })),
        internalSpaces: state.internalSpaces.map((s) => ({
          ...s,
          projects: updateProjects(s.projects),
        })),
      };
    }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    default:
      return state;
  }
}

// Context types
interface AppContextType {
  state: AppState;
  // Navigation
  selectClient: (clientId: string | null) => void;
  selectProject: (projectId: string | null) => void;
  setView: (view: ViewType) => void;
  toggleSidebar: () => void;
  // Filters & Sort
  setFilters: (filters: Partial<FilterState>) => void;
  setSort: (sort: SortState) => void;
  // Client operations
  addClient: (data: ClientFormData) => void;
  updateClient: (id: string, data: ClientFormData) => void;
  deleteClient: (id: string) => void;
  // Project operations
  addProject: (data: ProjectFormData) => void;
  updateProject: (id: string, data: ProjectFormData) => void;
  deleteProject: (id: string) => void;
  // Task operations
  addTask: (projectId: string, data: TaskFormData) => void;
  updateTask: (id: string, projectId: string, data: TaskFormData) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  // Event operations
  addEvent: (data: EventFormData) => void;
  updateEvent: (id: string, data: EventFormData) => void;
  deleteEvent: (projectId: string | undefined, eventId: string) => void;
  // Notification operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Helpers
  getSelectedClient: () => Client | undefined;
  getSelectedProject: () => Project | undefined;
  getAllProjects: () => Project[];
  getAllTasks: () => Task[];
  getAllEvents: () => Event[];
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Navigation
  const selectClient = useCallback((clientId: string | null) => {
    dispatch({ type: 'SELECT_CLIENT', payload: clientId });
  }, []);

  const selectProject = useCallback((projectId: string | null) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  }, []);

  const setView = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  // Filters & Sort
  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSort = useCallback((sort: SortState) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  // Client operations
  const addClient = useCallback((data: ClientFormData) => {
    const client: Client = {
      id: generateId(),
      ...data,
      projects: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CLIENT', payload: client });
  }, []);

  const updateClient = useCallback((id: string, data: ClientFormData) => {
    const existingClient = state.clients.find((c) => c.id === id);
    if (existingClient) {
      const updatedClient: Client = {
        ...existingClient,
        ...data,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    }
  }, [state.clients]);

  const deleteClient = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CLIENT', payload: id });
  }, []);

  // Project operations
  const addProject = useCallback((data: ProjectFormData) => {
    const project: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      clientId: data.clientId,
      internalSpaceId: data.internalSpaceId,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completedAt: undefined,
      teamMembers: data.teamMembers,
      tasks: [],
      events: [],
      lists: [],
      notes: [],
      tags: data.tags,
      createdBy: state.currentUser?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({
      type: 'ADD_PROJECT',
      payload: { clientId: data.clientId, spaceId: data.internalSpaceId, project },
    });
  }, [state.currentUser]);

  const updateProject = useCallback((id: string, data: ProjectFormData) => {
    const allProjects = getAllProjects();
    const existingProject = allProjects.find((p) => p.id === id);
    if (existingProject) {
      const updatedProject: Project = {
        ...existingProject,
        name: data.name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        teamMembers: data.teamMembers,
        tags: data.tags,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
    }
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  // Task operations
  const addTask = useCallback((projectId: string, data: TaskFormData) => {
    const task: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      projectId,
      listId: data.listId,
      status: data.status,
      priority: data.priority,
      assignees: data.assignees,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      dueTime: data.dueTime,
      completedAt: undefined,
      estimatedHours: undefined,
      actualHours: undefined,
      tags: data.tags,
      notes: [],
      subtasks: [],
      dependencies: [],
      createdBy: state.currentUser?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: { projectId, task } });
  }, [state.currentUser]);

  const updateTask = useCallback((id: string, _projectId: string, data: TaskFormData) => {
    const allTasks = getAllTasks();
    const existingTask = allTasks.find((t) => t.id === id);
    if (existingTask) {
      const updatedTask: Task = {
        ...existingTask,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignees: data.assignees,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        dueTime: data.dueTime,
        completedAt: data.status === 'completed' && !existingTask.completedAt ? new Date() : existingTask.completedAt,
        tags: data.tags,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    }
  }, []);

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { projectId, taskId } });
  }, []);

  // Event operations
  const addEvent = useCallback((data: EventFormData) => {
    const event: Event = {
      id: generateId(),
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      clientId: undefined,
      internalSpaceId: undefined,
      type: data.type,
      startDate: new Date(data.startDate),
      startTime: data.startTime,
      endDate: new Date(data.endDate),
      endTime: data.endTime,
      allDay: data.allDay,
      location: data.location,
      meetingLink: data.meetingLink,
      attendees: data.attendees.map((id) => ({
        id: generateId(),
        teamMemberId: id,
        name: state.teamMembers.find((m) => m.id === id)?.name || '',
        status: 'pending' as const,
        canViewDetails: true,
        notified: false,
      })),
      visibility: data.visibility,
      recurrence: undefined,
      reminders: [],
      notes: [],
      createdBy: state.currentUser?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_EVENT', payload: { projectId: data.projectId, event } });
  }, [state.currentUser, state.teamMembers]);

  const updateEvent = useCallback((id: string, data: EventFormData) => {
    const allEvents = getAllEvents();
    const existingEvent = allEvents.find((e) => e.id === id);
    if (existingEvent) {
      const updatedEvent: Event = {
        ...existingEvent,
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: new Date(data.startDate),
        startTime: data.startTime,
        endDate: new Date(data.endDate),
        endTime: data.endTime,
        allDay: data.allDay,
        location: data.location,
        meetingLink: data.meetingLink,
        visibility: data.visibility,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    }
  }, []);

  const deleteEvent = useCallback((projectId: string | undefined, eventId: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: { projectId, eventId } });
  }, []);

  // Notification operations
  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, []);

  // Helper functions
  const getSelectedClient = useCallback(() => {
    return state.clients.find((c) => c.id === state.selectedClientId);
  }, [state.clients, state.selectedClientId]);

  const getSelectedProject = useCallback(() => {
    const allProjects = getAllProjects();
    return allProjects.find((p) => p.id === state.selectedProjectId);
  }, [state.selectedProjectId]);

  const getAllProjects = useCallback((): Project[] => {
    const clientProjects = state.clients.flatMap((c) => c.projects);
    const internalProjects = state.internalSpaces.flatMap((s) => s.projects);
    return [...clientProjects, ...internalProjects];
  }, [state.clients, state.internalSpaces]);

  const getAllTasks = useCallback((): Task[] => {
    return getAllProjects().flatMap((p) => p.tasks);
  }, [getAllProjects]);

  const getAllEvents = useCallback((): Event[] => {
    return getAllProjects().flatMap((p) => p.events);
  }, [getAllProjects]);

  const contextValue: AppContextType = {
    state,
    selectClient,
    selectProject,
    setView,
    toggleSidebar,
    setFilters,
    setSort,
    addClient,
    updateClient,
    deleteClient,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addEvent,
    updateEvent,
    deleteEvent,
    markNotificationRead,
    markAllNotificationsRead,
    getSelectedClient,
    getSelectedProject,
    getAllProjects,
    getAllTasks,
    getAllEvents,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
