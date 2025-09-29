import React from 'react';
import { Calendar, Tag, FileText, Clock, CreditCard as Edit3 } from 'lucide-react';
import { Note } from '../../types';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  selectedNoteId?: string;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  onSelectNote, 
  selectedNoteId 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreview = (content: string) => {
    const text = content.replace(/[#*`]/g, '').trim();
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileText size={48} className="mb-4" />
        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
        <p className="text-sm">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 bg-white rounded-lg border transition-all cursor-pointer hover:shadow-md ${
            selectedNoteId === note.id
              ? 'border-indigo-300 ring-2 ring-indigo-100'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {note.title || 'Untitled Note'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
              <Clock size={14} />
              {formatDate(note.updatedAt)}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {getPreview(note.content)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {note.tags.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Tag size={12} />
                  <span>{note.tags.slice(0, 2).join(', ')}</span>
                  {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Edit3 size={12} />
              <Calendar size={12} />
              {formatDate(note.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};