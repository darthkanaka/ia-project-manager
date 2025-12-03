import React from 'react';
import type { TaskStatus, Priority, ProjectStatus } from '../../types';
import { getTaskStatusConfig, getPriorityConfig, getProjectStatusConfig } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  color?: string;
  bgColor?: string;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  color = 'text-gray-700',
  bgColor = 'bg-gray-100',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = variant === 'outline' ? 'border bg-transparent' : bgColor;

  return <span className={`${baseClasses} ${variantClasses} ${color} ${className}`}>{children}</span>;
}

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = getTaskStatusConfig(status);
  return (
    <Badge color={config.color} bgColor={config.bgColor} className={className}>
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = getPriorityConfig(priority);
  return (
    <Badge color={config.color} bgColor={config.bgColor} className={className}>
      {config.label}
    </Badge>
  );
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className = '' }: ProjectStatusBadgeProps) {
  const config = getProjectStatusConfig(status);
  return (
    <Badge color={config.color} bgColor={config.bgColor} className={className}>
      {config.label}
    </Badge>
  );
}

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ tag, onRemove, className = '' }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 ${className}`}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 -mr-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
