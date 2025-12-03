import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Globe,
  Lock,
} from 'lucide-react';
import type { Event, EventFormData, EventType, EventVisibility, TeamMember } from '../../types';
import { Modal, ModalFooter } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Dropdown, MultiSelect } from '../shared/Dropdown';
import { MentionTextarea } from '../shared/MentionTextarea';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
  onDelete?: () => void;
  event?: Event | null;
  projectId?: string;
  teamMembers: TeamMember[];
}

const eventTypeOptions = [
  { value: 'meeting', label: 'Meeting', icon: <Users className="w-4 h-4" /> },
  { value: 'call', label: 'Call', icon: <Video className="w-4 h-4" /> },
  { value: 'deadline', label: 'Deadline', icon: <Clock className="w-4 h-4" /> },
  { value: 'milestone', label: 'Milestone', icon: <Calendar className="w-4 h-4" /> },
  { value: 'reminder', label: 'Reminder', icon: <Clock className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <Calendar className="w-4 h-4" /> },
];

const visibilityOptions = [
  { value: 'public', label: 'Public', icon: <Globe className="w-4 h-4" /> },
  { value: 'team-only', label: 'Team Only', icon: <Users className="w-4 h-4" /> },
  { value: 'private', label: 'Private', icon: <Lock className="w-4 h-4" /> },
];

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  projectId,
  teamMembers,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('meeting');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<EventVisibility>('team-only');

  const isEditMode = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setType(event.type);
      setStartDate(new Date(event.startDate).toISOString().split('T')[0]);
      setStartTime(event.startTime);
      setEndDate(new Date(event.endDate).toISOString().split('T')[0]);
      setEndTime(event.endTime);
      setAllDay(event.allDay);
      setLocation(event.location || '');
      setMeetingLink(event.meetingLink || '');
      setAttendees(event.attendees.map((a) => a.teamMemberId).filter(Boolean) as string[]);
      setVisibility(event.visibility);
    } else {
      resetForm();
    }
  }, [event, isOpen]);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setTitle('');
    setDescription('');
    setType('meeting');
    setStartDate(today);
    setStartTime('09:00');
    setEndDate(today);
    setEndTime('10:00');
    setAllDay(false);
    setLocation('');
    setMeetingLink('');
    setAttendees([]);
    setVisibility('team-only');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      projectId,
      type,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      location: location.trim() || undefined,
      meetingLink: meetingLink.trim() || undefined,
      attendees,
      visibility,
    });

    onClose();
  };

  const memberOptions = teamMembers.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Event' : 'New Event'}
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
            placeholder="Enter event title"
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
            placeholder="Add description..."
            rows={3}
          />
        </div>

        {/* Event Type & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <Dropdown
              options={eventTypeOptions}
              value={type}
              onChange={(val) => setType(val as EventType)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <Dropdown
              options={visibilityOptions}
              value={visibility}
              onChange={(val) => setVisibility(val as EventVisibility)}
            />
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allDay"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="allDay" className="text-sm text-gray-700">
            All day event
          </label>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) {
                  setEndDate(e.target.value);
                }
              }}
              className="input-field"
              required
            />
          </div>
          {!allDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input-field"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="input-field"
              required
            />
          </div>
          {!allDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input-field"
              />
            </div>
          )}
        </div>

        {/* Location & Meeting Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Video className="w-4 h-4 inline mr-1" />
            Meeting Link
          </label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://meet.google.com/..."
            className="input-field"
          />
        </div>

        {/* Attendees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Attendees
          </label>
          <MultiSelect
            options={memberOptions}
            values={attendees}
            onChange={setAttendees}
            placeholder="Select attendees"
          />
        </div>

        <ModalFooter>
          {isEditMode && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="mr-auto"
            >
              Delete Event
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Create Event'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
