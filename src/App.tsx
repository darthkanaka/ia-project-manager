import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TimelineView, CalendarView, ListView, ClientView } from './components/views';
import { TaskModal } from './components/modals/TaskModal';
import { EventModal } from './components/modals/EventModal';
import { ClientModal } from './components/modals/ClientModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { EmptyState } from './components/shared/EmptyState';
import type { Task, Event, Project, ViewType } from './types';
import { Home, LayoutList, Calendar, Clock } from 'lucide-react';
import './App.css';

// View Switcher Component
function ViewSwitcher({
  currentView,
  onViewChange
}: {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) {
  const views: { id: ViewType; label: string; icon: ReactNode }[] = [
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'list', label: 'List', icon: <LayoutList className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentView === view.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {view.icon}
          {view.label}
        </button>
      ))}
    </div>
  );
}

function AppContent() {
  const {
    state,
    selectClient,
    setView,
    toggleSidebar,
    addClient,
    addProject,
    addTask,
    updateTask,
    deleteTask,
    addEvent,
    markNotificationRead,
    markAllNotificationsRead,
    getSelectedClient,
    getAllTasks,
    getAllEvents,
  } = useApp();

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<string | undefined>();

  const selectedClient = getSelectedClient();

  // Handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    if (selectedClient && selectedClient.projects.length > 0) {
      setSelectedProjectForModal(selectedClient.projects[0].id);
    }
    setShowTaskModal(true);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    if (selectedClient && selectedClient.projects.length > 0) {
      setSelectedProjectForModal(selectedClient.projects[0].id);
    }
    setShowEventModal(true);
  };

  const handleAddClient = () => {
    setShowClientModal(true);
  };

  const handleAddProject = () => {
    setShowProjectModal(true);
  };

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.id);
  };

  const handleSaveTask = (data: Parameters<typeof addTask>[1]) => {
    if (selectedTask) {
      updateTask(selectedTask.id, selectedTask.projectId, data);
    } else if (selectedProjectForModal) {
      addTask(selectedProjectForModal, data);
    }
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.projectId, selectedTask.id);
      setShowTaskModal(false);
      setSelectedTask(null);
    }
  };

  const handleSaveEvent = (data: Parameters<typeof addEvent>[0]) => {
    addEvent(data);
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleSaveClient = (data: Parameters<typeof addClient>[0]) => {
    addClient(data);
    setShowClientModal(false);
  };

  const handleSaveProject = (data: Parameters<typeof addProject>[0]) => {
    addProject(data);
    setShowProjectModal(false);
  };

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    const task = getAllTasks().find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, task.projectId, {
        ...task,
        status: completed ? 'completed' : 'todo',
        dueDate: task.dueDate?.toISOString().split('T')[0],
      });
    }
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const getDisplayedTasks = (): Task[] => {
    if (selectedClient) {
      return selectedClient.projects.flatMap((p) => p.tasks);
    }
    return getAllTasks();
  };

  const getDisplayedEvents = (): Event[] => {
    if (selectedClient) {
      return selectedClient.projects.flatMap((p) => p.events);
    }
    return getAllEvents();
  };

  const renderMainContent = () => {
    if (selectedClient) {
      return (
        <ClientView
          client={selectedClient}
          teamMembers={state.teamMembers}
          onEditClient={() => setShowClientModal(true)}
          onAddProject={handleAddProject}
          onProjectClick={handleProjectClick}
          onViewChange={setView}
          currentView={state.selectedView}
        />
      );
    }

    const tasks = getDisplayedTasks();
    const events = getDisplayedEvents();

    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {state.currentUser?.name}. Here's your overview.
            </p>
          </div>
          {(tasks.length > 0 || events.length > 0) && (
            <ViewSwitcher currentView={state.selectedView} onViewChange={setView} />
          )}
        </div>

        {tasks.length === 0 && events.length === 0 ? (
          <EmptyState
            icon={<Home className="w-12 h-12" />}
            title="Get started"
            description="Select a client from the sidebar or create a new one to get started"
            action={{ label: 'Add Client', onClick: handleAddClient }}
          />
        ) : (
          <>
            {state.selectedView === 'timeline' && (
              <TimelineView
                tasks={tasks}
                events={events}
                teamMembers={state.teamMembers}
                onTaskClick={handleTaskClick}
                onEventClick={handleEventClick}
              />
            )}
            {state.selectedView === 'calendar' && (
              <CalendarView
                tasks={tasks}
                events={events}
                teamMembers={state.teamMembers}
                onTaskClick={handleTaskClick}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
            {state.selectedView === 'list' && (
              <ListView
                tasks={tasks}
                teamMembers={state.teamMembers}
                onTaskClick={handleTaskClick}
                onTaskStatusChange={handleTaskStatusChange}
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        clients={state.clients}
        internalSpaces={state.internalSpaces}
        selectedClientId={state.selectedClientId}
        selectedSpaceId={null}
        onClientSelect={selectClient}
        onSpaceSelect={() => {}}
        onAddClient={handleAddClient}
        onAddSpace={() => {}}
        onHomeClick={() => selectClient(null)}
        collapsed={state.sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentUser={state.currentUser}
          notifications={state.notifications}
          onToggleSidebar={toggleSidebar}
          onNewTask={handleNewTask}
          onNewEvent={handleNewEvent}
          onNotificationClick={(n) => markNotificationRead(n.id)}
          onMarkAllRead={markAllNotificationsRead}
          onSearch={handleSearch}
        />

        <main className="flex-1 overflow-hidden">{renderMainContent()}</main>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        task={selectedTask}
        projectId={selectedTask?.projectId || selectedProjectForModal || ''}
        teamMembers={state.teamMembers}
      />

      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        event={selectedEvent}
        projectId={selectedEvent?.projectId || selectedProjectForModal}
        teamMembers={state.teamMembers}
      />

      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSave={handleSaveClient}
        teamMembers={state.teamMembers}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleSaveProject}
        clientId={state.selectedClientId || undefined}
        teamMembers={state.teamMembers}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
