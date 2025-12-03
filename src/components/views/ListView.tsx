import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  MoreHorizontal,
  Calendar,
  Clock,
} from 'lucide-react';
import type { Task, TeamMember, FilterState, SortState } from '../../types';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '../shared/Badge';
import { AvatarGroup } from '../shared/Avatar';
import { EmptyState } from '../shared/EmptyState';
import { SearchInput } from '../shared/SearchInput';
import { Dropdown } from '../shared/Dropdown';
import { formatRelativeDate, filterTasks, sortTasks, groupBy } from '../../utils';

interface ListViewProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, completed: boolean) => void;
  groupByField?: 'status' | 'priority' | 'assignee' | 'dueDate' | 'none';
}

const sortOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Created Date' },
];

const groupOptions = [
  { value: 'none', label: 'No Grouping' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'assignee', label: 'Assignee' },
];

export function ListView({
  tasks,
  teamMembers,
  onTaskClick,
  onTaskStatusChange,
  groupByField = 'none',
}: ListViewProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [groupBy_, setGroupBy_] = useState(groupByField);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const filteredTasks = useMemo(() => {
    const filters: FilterState = {
      search,
      status: [],
      priority: [],
      assignees: [],
      tags: [],
      showCompleted: true,
    };
    return filterTasks(tasks, filters);
  }, [tasks, search]);

  const sortedTasks = useMemo(() => {
    const sort: SortState = {
      field: sortField as SortState['field'],
      direction: sortDirection,
    };
    return sortTasks(filteredTasks, sort);
  }, [filteredTasks, sortField, sortDirection]);

  const groupedTasks = useMemo(() => {
    if (groupBy_ === 'none') {
      return { 'All Tasks': sortedTasks };
    }

    if (groupBy_ === 'status') {
      return groupBy(sortedTasks, 'status');
    }

    if (groupBy_ === 'priority') {
      return groupBy(sortedTasks, 'priority');
    }

    if (groupBy_ === 'assignee') {
      const result: Record<string, Task[]> = { 'Unassigned': [] };
      sortedTasks.forEach((task) => {
        if (task.assignees.length === 0) {
          result['Unassigned'].push(task);
        } else {
          task.assignees.forEach((assigneeId) => {
            const member = teamMembers.find((m) => m.id === assigneeId);
            const name = member?.name || 'Unknown';
            if (!result[name]) result[name] = [];
            result[name].push(task);
          });
        }
      });
      if (result['Unassigned'].length === 0) delete result['Unassigned'];
      return result;
    }

    return { 'All Tasks': sortedTasks };
  }, [sortedTasks, groupBy_, teamMembers]);

  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAssignees = (task: Task) => {
    return task.assignees
      .map((id) => teamMembers.find((m) => m.id === id))
      .filter(Boolean) as TeamMember[];
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          className="w-64"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Dropdown
            options={sortOptions}
            value={sortField}
            onChange={(val) => toggleSort(val)}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Group by:</span>
          <Dropdown
            options={groupOptions}
            value={groupBy_}
            onChange={(val) => setGroupBy_(val as typeof groupBy_)}
            className="w-32"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName} className="card overflow-hidden">
            {/* Group Header */}
            {groupBy_ !== 'none' && (
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
              >
                {collapsedGroups.has(groupName) ? (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-medium text-gray-900">{groupName}</span>
                <span className="text-sm text-gray-500">({groupTasks.length})</span>
              </button>
            )}

            {/* Tasks */}
            {!collapsedGroups.has(groupName) && (
              <div className="divide-y divide-gray-100">
                {groupTasks.map((task) => {
                  const assignees = getAssignees(task);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskStatusChange(task.id, task.status !== 'completed');
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-green-500"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-medium truncate ${
                              task.status === 'completed'
                                ? 'text-gray-400 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <TaskStatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                          {task.tags.slice(0, 2).map((tag) => (
                            <TagBadge key={tag} tag={tag} />
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                          <Calendar className="w-4 h-4" />
                          <span>{formatRelativeDate(task.dueDate)}</span>
                          {task.dueTime && (
                            <>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{task.dueTime}</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Assignees */}
                      {assignees.length > 0 && (
                        <div className="flex-shrink-0">
                          <AvatarGroup
                            users={assignees.map((a) => ({
                              id: a.id,
                              name: a.name,
                              avatar: a.avatar,
                            }))}
                            max={2}
                            size="xs"
                          />
                        </div>
                      )}

                      {/* More Options */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && search && (
        <EmptyState
          title="No matching tasks"
          description={`No tasks match "${search}"`}
        />
      )}
    </div>
  );
}
