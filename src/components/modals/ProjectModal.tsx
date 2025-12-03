import React, { useState, useEffect } from 'react';
import { Calendar, Users, Tag } from 'lucide-react';
import type { Project, ProjectFormData, ProjectStatus, Priority, TeamMember } from '../../types';
import { Modal, ModalFooter } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Dropdown, MultiSelect } from '../shared/Dropdown';
import { TagBadge, ProjectStatusBadge, PriorityBadge } from '../shared/Badge';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectFormData) => void;
  onDelete?: () => void;
  project?: Project | null;
  clientId?: string;
  internalSpaceId?: string;
  teamMembers: TeamMember[];
}

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  project,
  clientId,
  internalSpaceId,
  teamMembers,
}: ProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [priority, setPriority] = useState<Priority>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const isEditMode = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setStatus(project.status);
      setPriority(project.priority);
      setStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
      setDueDate(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '');
      setSelectedTeamMembers(project.teamMembers);
      setTags(project.tags);
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus('planning');
    setPriority('medium');
    setStartDate('');
    setDueDate('');
    setSelectedTeamMembers([]);
    setTags([]);
    setNewTag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      clientId,
      internalSpaceId,
      status,
      priority,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      teamMembers: selectedTeamMembers,
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

  const memberOptions = teamMembers.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Project' : 'New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className="input-field"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add project description..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Dropdown
              options={statusOptions}
              value={status}
              onChange={(val) => setStatus(val as ProjectStatus)}
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

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={startDate}
              className="input-field"
            />
          </div>
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Team Members
          </label>
          <MultiSelect
            options={memberOptions}
            values={selectedTeamMembers}
            onChange={setSelectedTeamMembers}
            placeholder="Select team members"
          />
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

        {/* Preview */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-gray-500">Preview:</span>
          <ProjectStatusBadge status={status} />
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
              Delete Project
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Create Project'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
