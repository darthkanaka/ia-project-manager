import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task, Event, TeamMember } from '../../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { IconButton } from '../shared/Button';

interface CalendarViewProps {
  tasks: Task[];
  events: Event[];
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
}

interface DayItem {
  id: string;
  type: 'task' | 'event';
  title: string;
  color: string;
  data: Task | Event;
}

export function CalendarView({
  tasks,
  events,
  onTaskClick,
  onEventClick,
  onDateClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getItemsForDate = (date: Date): DayItem[] => {
    const items: DayItem[] = [];

    // Add tasks due on this date
    tasks.forEach((task) => {
      if (task.dueDate && isSameDay(new Date(task.dueDate), date)) {
        items.push({
          id: task.id,
          type: 'task',
          title: task.title,
          color: task.status === 'completed' ? 'bg-green-500' :
                 task.status === 'urgent' ? 'bg-orange-500' :
                 task.status === 'blocked' ? 'bg-red-500' : 'bg-blue-500',
          data: task,
        });
      }
    });

    // Add events on this date
    events.forEach((event) => {
      if (isSameDay(new Date(event.startDate), date)) {
        items.push({
          id: event.id,
          type: 'event',
          title: event.title,
          color: 'bg-purple-500',
          data: event,
        });
      }
    });

    return items;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Today
          </button>
          <IconButton
            icon={<ChevronLeft className="w-5 h-5" />}
            onClick={handlePrevMonth}
            label="Previous month"
          />
          <IconButton
            icon={<ChevronRight className="w-5 h-5" />}
            onClick={handleNextMonth}
            label="Next month"
          />
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 border-l border-gray-200">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const items = getItemsForDate(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`min-h-[100px] border-r border-b border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              }`}
            >
              {/* Day Number */}
              <div
                className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday(day)
                    ? 'bg-blue-600 text-white'
                    : isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </div>

              {/* Items */}
              <div className="space-y-1">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'task') {
                        onTaskClick(item.data as Task);
                      } else {
                        onEventClick(item.data as Event);
                      }
                    }}
                    className={`${item.color} text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80`}
                  >
                    {item.title}
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
