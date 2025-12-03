import React from 'react';
import { getInitials, getColorFromString } from '../../utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTooltip?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({ name, src, size = 'md', className = '', showTooltip = false }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromString(name);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-medium text-white ${bgColor} ${sizeClasses[size]} ${className}`}
      title={showTooltip ? name : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ id: string; name: string; avatar?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user) => (
        <Avatar
          key={user.id}
          name={user.name}
          src={user.avatar}
          size={size}
          className="ring-2 ring-white"
          showTooltip
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium ring-2 ring-white ${sizeClasses[size]}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
