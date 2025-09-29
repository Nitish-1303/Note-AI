import React, { useState, useEffect } from 'react';
import { Save, Tag, Folder, Sparkles, Eye, CreditCard as Edit } from 'lucide-react';
import { Note, Folder as FolderType } from '../../types';

interface NoteEditorProps {
  note?: Note | null;
  folders: FolderType[];
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Note>) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  folders,
  onSave,
  onUpdate
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [folderId, setFolderId] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setFolderId(note.folderId || '');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setFolderId('');
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    
    const noteData = {
      title: title.trim() || 'Untitled Note',
      content,
      tags,
      folderId: folderId || undefined,
      userId: '1',
      isMarkdown: true
    };

    if (note && onUpdate) {
      onUpdate(note.id, noteData);
    } else {
      onSave(noteData);
    }

    setIsSaving(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for preview
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-xl font-semibold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isPreview
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPreview ? <Edit size={16} /> : <Eye size={16} />}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-gray-500" />
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="text-sm border-none outline-none bg-transparent text-gray-700"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            <div className="flex items-center gap-1 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full cursor-pointer hover:bg-indigo-200"
                >
                  {tag} ×
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="text-sm bg-transparent border-none outline-none placeholder-gray-400 min-w-20"
              />
            </div>
          </div>

          <button className="ml-auto text-gray-500 hover:text-indigo-600 transition-colors">
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {isPreview ? (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note... (Markdown supported)"
            className="w-full h-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 leading-relaxed"
            onKeyPress={handleKeyPress}
          />
        )}
      </div>
    </div>
  );
};