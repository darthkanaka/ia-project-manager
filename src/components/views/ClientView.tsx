import { useState } from 'react';
import {
  Building2,
  FolderKanban,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  Plus,
  Settings,
  Calendar,
  List,
  Clock,
} from 'lucide-react';
import type { Client, Project, TeamMember, ViewType } from '../../types';
import { Tabs, TabPanel } from '../shared/Tabs';
import { Button, IconButton } from '../shared/Button';
import { Avatar, AvatarGroup } from '../shared/Avatar';
import { Badge } from '../shared/Badge';
import { EmptyState } from '../shared/EmptyState';
import { getClientStatusConfig, getProjectProgress } from '../../utils';

interface ClientViewProps {
  client: Client;
  teamMembers: TeamMember[];
  onEditClient: () => void;
  onAddProject: () => void;
  onProjectClick: (project: Project) => void;
  onViewChange: (view: ViewType) => void;
  currentView: ViewType;
}

export function ClientView({
  client,
  teamMembers,
  onEditClient,
  onAddProject,
  onProjectClick,
  onViewChange,
  currentView,
}: ClientViewProps) {
  const [activeTab, setActiveTab] = useState('projects');

  const statusConfig = getClientStatusConfig(client.status);

  const tabs = [
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" />, count: client.projects.length },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, count: client.notes.length },
    { id: 'team', label: 'Team', icon: <Building2 className="w-4 h-4" />, count: client.teamMembers.length },
  ];

  const viewTabs = [
    { id: 'timeline', icon: <Clock className="w-4 h-4" />, label: 'Timeline' },
    { id: 'calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
    { id: 'list', icon: <List className="w-4 h-4" />, label: 'List' },
  ];

  const getTeamMember = (id: string) => teamMembers.find((m) => m.id === id);

  return (
    <div className="h-full flex flex-col">
      {/* Client Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Client Logo/Avatar */}
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>

            {/* Client Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                <Badge color={statusConfig.color} bgColor={statusConfig.bgColor}>
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {client.contactEmail && (
                  <a
                    href={`mailto:${client.contactEmail}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Mail className="w-4 h-4" />
                    {client.contactEmail}
                  </a>
                )}
                {client.contactPhone && (
                  <a
                    href={`tel:${client.contactPhone}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Phone className="w-4 h-4" />
                    {client.contactPhone}
                  </a>
                )}
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
              {client.address && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  {client.address}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Settings className="w-5 h-5" />}
              onClick={onEditClient}
              label="Edit client"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-4">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id as ViewType)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-white">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'projects' && (
          <TabPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={onAddProject}
              >
                New Project
              </Button>
            </div>

            {client.projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {client.projects.map((project) => {
                  const progress = getProjectProgress(project);
                  const projectTeam = project.teamMembers
                    .map((id) => getTeamMember(id))
                    .filter(Boolean) as TeamMember[];

                  return (
                    <div
                      key={project.id}
                      onClick={() => onProjectClick(project)}
                      className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <Badge
                          color={
                            project.status === 'active'
                              ? 'text-green-600'
                              : project.status === 'on-hold'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                          }
                          bgColor={
                            project.status === 'active'
                              ? 'bg-green-100'
                              : project.status === 'on-hold'
                              ? 'bg-yellow-100'
                              : 'bg-gray-100'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>

                      {project.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                          <span className="font-medium text-gray-900">{project.tasks.length}</span> tasks
                        </div>
                        {projectTeam.length > 0 && (
                          <AvatarGroup
                            users={projectTeam.map((m) => ({
                              id: m.id,
                              name: m.name,
                              avatar: m.avatar,
                            }))}
                            max={3}
                            size="xs"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<FolderKanban className="w-12 h-12" />}
                title="No projects yet"
                description="Create your first project for this client"
                action={{ label: 'Create Project', onClick: onAddProject }}
              />
            )}
          </TabPanel>
        )}

        {activeTab === 'notes' && (
          <TabPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Note
              </Button>
            </div>

            {client.notes.length > 0 ? (
              <div className="space-y-3">
                {client.notes.map((note) => {
                  const author = getTeamMember(note.authorId);
                  return (
                    <div key={note.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={author?.name || 'Unknown'}
                          src={author?.avatar}
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {author?.name || 'Unknown'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="w-12 h-12" />}
                title="No notes yet"
                description="Add notes about this client"
              />
            )}
          </TabPanel>
        )}

        {activeTab === 'team' && (
          <TabPanel>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>

            {client.teamMembers.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {client.teamMembers.map((memberId) => {
                  const member = getTeamMember(memberId);
                  if (!member) return null;

                  return (
                    <div key={member.id} className="card p-4 flex items-center gap-3">
                      <Avatar name={member.name} src={member.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{member.name}</div>
                        <div className="text-sm text-gray-500 truncate">{member.email}</div>
                        {member.department && (
                          <div className="text-xs text-gray-400">{member.department}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Building2 className="w-12 h-12" />}
                title="No team members assigned"
                description="Add team members who have access to this client"
              />
            )}
          </TabPanel>
        )}
      </div>
    </div>
  );
}
