import { useState, useEffect } from 'react';
import { Note, Folder } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    const savedFolders = localStorage.getItem('folders');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Create default folders
      const defaultFolders: Folder[] = [
        {
          id: 'personal',
          name: 'Personal',
          color: '#6366f1',
          userId: '1',
          createdAt: new Date().toISOString()
        },
        {
          id: 'work',
          name: 'Work',
          color: '#10b981',
          userId: '1',
          createdAt: new Date().toISOString()
        }
      ];
      setFolders(defaultFolders);
      localStorage.setItem('folders', JSON.stringify(defaultFolders));
    }
    
    setIsLoading(false);
  }, []);

  const createNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    return notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return {
    notes,
    folders,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  };
};