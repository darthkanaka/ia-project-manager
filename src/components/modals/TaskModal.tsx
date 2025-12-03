import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Flag,
  Tag,
  Users,
  Plus,
  Trash2,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { Task, TaskFormData, TaskStatus, Priority, TeamMember, Subtask } from '../../types';
import { Modal, ModalFooter } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Dropdown, MultiSelect } from '../shared/Dropdown';
import { MentionTextarea } from '../shared/MentionTextarea';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '../shared/Badge';
import { generateId } from '../../utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  onDelete?: () => void;
  task?: Task | null;
  projectId: string;
  teamMembers: TeamMember[];
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  projectId,
  teamMembers,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setAssignees(task.assignees);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setDueTime(task.dueTime || '');
      setTags(task.tags);
      setSubtasks(task.subtasks);
    } else {
      resetForm();
    }
  }, [task, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setAssignees([]);
    setDueDate('');
    setDueTime('');
    setTags([]);
    setNewTag('');
    setSubtasks([]);
    setNewSubtask('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      projectId,
      status,
      priority,
      assignees,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      tags,
    });

    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: generateId(), title: newSubtask.trim(), completed: false },
      ]);
      setNewSubtask('');
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId));
  };

  const memberOptions = teamMembers.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Task' : 'New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="input-field"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <MentionTextarea
            value={description}
            onChange={setDescription}
            teamMembers={teamMembers}
            placeholder="Add description... Use @ to mention team members"
            rows={3}
          />
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Flag className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <Dropdown
              options={statusOptions}
              value={status}
              onChange={(val) => setStatus(val as TaskStatus)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Dropdown
              options={priorityOptions}
              value={priority}
              onChange={(val) => setPriority(val as Priority)}
            />
          </div>
        </div>

        {/* Assignees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Assignees
          </label>
          <MultiSelect
            options={memberOptions}
            values={assignees}
            onChange={setAssignees}
            placeholder="Select assignees"
          />
        </div>

        {/* Due Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Due Time
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="input-field flex-1"
            />
            <Button type="button" variant="secondary" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtasks
          </label>
          <div className="space-y-2 mb-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 group">
                <button
                  type="button"
                  onClick={() => toggleSubtask(subtask.id)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  {subtask.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`flex-1 ${subtask.completed ? 'line-through text-gray-400' : ''}`}
                >
                  {subtask.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add a subtask"
              className="input-field flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addSubtask}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-gray-500">Preview:</span>
          <TaskStatusBadge status={status} />
          <PriorityBadge priority={priority} />
        </div>

        <ModalFooter>
          {isEditMode && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="mr-auto"
            >
              Delete Task
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
