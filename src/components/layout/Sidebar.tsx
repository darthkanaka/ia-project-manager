import { useState } from 'react';
import {
  Home,
  Building2,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Layers,
} from 'lucide-react';
import type { Client, InternalSpace } from '../../types';
import { getInitials, getColorFromString } from '../../utils';

interface SidebarProps {
  clients: Client[];
  internalSpaces: InternalSpace[];
  selectedClientId: string | null;
  selectedSpaceId: string | null;
  onClientSelect: (clientId: string) => void;
  onSpaceSelect: (spaceId: string) => void;
  onAddClient: () => void;
  onAddSpace: () => void;
  onHomeClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { id: string; name: string; icon?: React.ReactNode; color?: string }[];
  onAdd?: () => void;
  onItemClick: (id: string) => void;
  selectedId: string | null;
}

export function Sidebar({
  clients,
  internalSpaces,
  selectedClientId,
  selectedSpaceId,
  onClientSelect,
  onSpaceSelect,
  onAddClient,
  onAddSpace,
  onHomeClick,
  collapsed,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['clients', 'spaces'])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections: NavSection[] = [
    {
      id: 'clients',
      title: 'Clients',
      icon: <Building2 className="w-4 h-4" />,
      items: clients.map((c) => ({
        id: c.id,
        name: c.name,
        color: getColorFromString(c.name),
      })),
      onAdd: onAddClient,
      onItemClick: onClientSelect,
      selectedId: selectedClientId,
    },
    {
      id: 'spaces',
      title: 'Internal Spaces',
      icon: <Layers className="w-4 h-4" />,
      items: internalSpaces.map((s) => ({
        id: s.id,
        name: s.name,
        color: s.color ? `bg-[${s.color}]` : getColorFromString(s.name),
      })),
      onAdd: onAddSpace,
      onItemClick: onSpaceSelect,
      selectedId: selectedSpaceId,
    },
  ];

  if (collapsed) {
    return (
      <div className="w-16 bg-gray-900 text-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            PM
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <button
            onClick={onHomeClick}
            className="w-full p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            className="w-full p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            title="Clients"
          >
            <Building2 className="w-5 h-5" />
          </button>
          <button
            className="w-full p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            title="Internal Spaces"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            className="w-full p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            title="Calendar"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </nav>
        <div className="p-2 border-t border-gray-800">
          <button
            className="w-full p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            PM
          </div>
          <span className="font-semibold">Project Manager</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Home */}
        <button
          onClick={onHomeClick}
          className={`w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
            !selectedClientId && !selectedSpaceId ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id} className="mt-4">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <div className="flex items-center gap-2">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <div className="flex items-center gap-1">
                {section.onAdd && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      section.onAdd?.();
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Section Items */}
            {expandedSections.has(section.id) && (
              <div className="mt-1 space-y-1">
                {section.items.length > 0 ? (
                  section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => section.onItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        section.selectedId === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${
                          item.color || 'bg-gray-600'
                        } text-white`}
                      >
                        {getInitials(item.name).charAt(0)}
                      </div>
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No items</div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-2 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
