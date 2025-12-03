import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { TeamMember } from '../../types';
import { getInitials, getColorFromString } from '../../utils';

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  teamMembers: TeamMember[];
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export function MentionTextarea({
  value,
  onChange,
  placeholder = 'Type @ to mention someone...',
  teamMembers,
  className = '',
  rows = 3,
  disabled = false,
}: MentionTextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    setCursorPosition(position);
    onChange(newValue);

    // Check for @ mention trigger
    const textBeforeCursor = newValue.slice(0, position);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionSearch(mentionMatch[1]);
      setShowSuggestions(true);
      setSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setMentionSearch('');
    }
  };

  const insertMention = useCallback(
    (member: TeamMember) => {
      const textBeforeCursor = value.slice(0, cursorPosition);
      const textAfterCursor = value.slice(cursorPosition);
      const mentionStart = textBeforeCursor.lastIndexOf('@');

      const newValue =
        textBeforeCursor.slice(0, mentionStart) +
        `@[${member.name}](${member.id}) ` +
        textAfterCursor;

      onChange(newValue);
      setShowSuggestions(false);
      setMentionSearch('');

      // Focus back on textarea
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = mentionStart + `@[${member.name}](${member.id}) `.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    },
    [value, cursorPosition, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || filteredMembers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % filteredMembers.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSuggestionIndex((prev) => (prev - 1 + filteredMembers.length) % filteredMembers.length);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        insertMention(filteredMembers[suggestionIndex]);
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`input-field resize-none ${className}`}
      />

      {showSuggestions && filteredMembers.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredMembers.map((member, index) => (
            <button
              key={member.id}
              type="button"
              onClick={() => insertMention(member)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
                index === suggestionIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColorFromString(
                  member.name
                )}`}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(member.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{member.name}</div>
                <div className="text-xs text-gray-500 truncate">{member.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
