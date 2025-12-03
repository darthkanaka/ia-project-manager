import React, { useState, useEffect } from 'react';
import { Mail, Phone, Globe, MapPin, Users } from 'lucide-react';
import type { Client, ClientFormData, ClientStatus, TeamMember } from '../../types';
import { Modal, ModalFooter } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Dropdown, MultiSelect } from '../shared/Dropdown';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientFormData) => void;
  onDelete?: () => void;
  client?: Client | null;
  teamMembers: TeamMember[];
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

export function ClientModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  client,
  teamMembers,
}: ClientModalProps) {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<ClientStatus>('active');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  const isEditMode = !!client;

  useEffect(() => {
    if (client) {
      setName(client.name);
      setContactEmail(client.contactEmail || '');
      setContactPhone(client.contactPhone || '');
      setWebsite(client.website || '');
      setAddress(client.address || '');
      setStatus(client.status);
      setSelectedTeamMembers(client.teamMembers);
    } else {
      resetForm();
    }
  }, [client, isOpen]);

  const resetForm = () => {
    setName('');
    setContactEmail('');
    setContactPhone('');
    setWebsite('');
    setAddress('');
    setStatus('active');
    setSelectedTeamMembers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || undefined,
      status,
      teamMembers: selectedTeamMembers,
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
      title={isEditMode ? 'Edit Client' : 'New Client'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter client name"
            className="input-field"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Dropdown
            options={statusOptions}
            value={status}
            onChange={(val) => setStatus(val as ClientStatus)}
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@client.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Contact Phone
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="input-field"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="w-4 h-4 inline mr-1" />
            Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://client.com"
            className="input-field"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Business Ave, Suite 100, City, State 12345"
            rows={2}
            className="input-field resize-none"
          />
        </div>

        {/* Team Members with Access */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Team Members with Access
          </label>
          <MultiSelect
            options={memberOptions}
            values={selectedTeamMembers}
            onChange={setSelectedTeamMembers}
            placeholder="Select team members"
          />
          <p className="mt-1 text-xs text-gray-500">
            These team members will have access to this client and its projects.
          </p>
        </div>

        <ModalFooter>
          {isEditMode && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              className="mr-auto"
            >
              Delete Client
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Create Client'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
