import React, { useMemo } from 'react';
import { Clock, CheckCircle, AlertCircle, PlayCircle, PauseCircle, AlertTriangle } from 'lucide-react';
import type { Task, Event, TeamMember, TaskStatus } from '../../types';
import { formatRelativeDate, formatTimeFromString, groupBy, isOverdue } from '../../utils';
import { TaskStatusBadge, PriorityBadge } from '../shared/Badge';
import { Avatar, AvatarGroup } from '../shared/Avatar';
import { EmptyState } from '../shared/EmptyState';

interface TimelineViewProps {
  tasks: Task[];
  events: Event[];
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
  onEventClick: (event: Event) => void;
}

interface TimelineItem {
  id: string;
  type: 'task' | 'event';
  title: string;
  date: Date;
  time?: string;
  data: Task | Event;
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  'todo': <Clock className="w-4 h-4 text-gray-500" />,
  'in-progress': <PlayCircle className="w-4 h-4 text-blue-500" />,
  'blocked': <AlertCircle className="w-4 h-4 text-red-500" />,
  'on-hold': <PauseCircle className="w-4 h-4 text-yellow-500" />,
  'urgent': <AlertTriangle className="w-4 h-4 text-orange-500" />,
  'completed': <CheckCircle className="w-4 h-4 text-green-500" />,
};

export function TimelineView({
  tasks,
  events,
  teamMembers,
  onTaskClick,
  onEventClick,
}: TimelineViewProps) {
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Add tasks with due dates
    tasks.forEach((task) => {
      if (task.dueDate) {
        items.push({
          id: task.id,
          type: 'task',
          title: task.title,
          date: new Date(task.dueDate),
          time: task.dueTime,
          data: task,
        });
      }
    });

    // Add events
    events.forEach((event) => {
      items.push({
        id: event.id,
        type: 'event',
        title: event.title,
        date: new Date(event.startDate),
        time: event.startTime,
        data: event,
      });
    });

    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime());

    return items;
  }, [tasks, events]);

  const groupedItems = useMemo(() => {
    return groupBy(timelineItems, (item) => formatRelativeDate(item.date));
  }, [timelineItems]);

  if (timelineItems.length === 0) {
    return (
      <EmptyState
        title="No items to display"
        description="Tasks with due dates and events will appear here"
      />
    );
  }

  const getAssignees = (task: Task) => {
    return task.assignees
      .map((id) => teamMembers.find((m) => m.id === id))
      .filter(Boolean) as TeamMember[];
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          {/* Date Header */}
          <div className="sticky top-0 bg-gray-50 py-2 px-4 -mx-4 mb-3">
            <h3 className="text-sm font-semibold text-gray-700">{dateLabel}</h3>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {items.map((item) => {
              if (item.type === 'task') {
                const task = item.data as Task;
                const assignees = getAssignees(task);
                const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

                return (
                  <div
                    key={item.id}
                    onClick={() => onTaskClick(task)}
                    className={`card p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      overdue ? 'border-red-200 bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{statusIcons[task.status]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium text-gray-900 truncate ${
                              task.status === 'completed' ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          {overdue && (
                            <span className="text-xs text-red-600 font-medium">Overdue</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <TaskStatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                          {item.time && (
                            <span className="text-xs text-gray-500">
                              {formatTimeFromString(item.time)}
                            </span>
                          )}
                        </div>
                      </div>
                      {assignees.length > 0 && (
                        <AvatarGroup
                          users={assignees.map((a) => ({
                            id: a.id,
                            name: a.name,
                            avatar: a.avatar,
                          }))}
                          max={3}
                          size="xs"
                        />
                      )}
                    </div>
                  </div>
                );
              } else {
                const event = item.data as Event;
                return (
                  <div
                    key={item.id}
                    onClick={() => onEventClick(event)}
                    className="card p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Clock className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{formatTimeFromString(event.startTime)}</span>
                          {!event.allDay && (
                            <>
                              <span>-</span>
                              <span>{formatTimeFromString(event.endTime)}</span>
                            </>
                          )}
                          {event.location && (
                            <>
                              <span className="mx-1">|</span>
                              <span className="truncate">{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {event.attendees.length > 0 && (
                        <AvatarGroup
                          users={event.attendees.map((a) => ({
                            id: a.id,
                            name: a.name,
                          }))}
                          max={3}
                          size="xs"
                        />
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
