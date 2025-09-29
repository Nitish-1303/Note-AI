import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { NoteList } from './components/Notes/NoteList';
import { NoteEditor } from './components/Notes/NoteEditor';
import { SearchView } from './components/Search/SearchView';
import { Note } from './types';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const { notes, folders, createNote, updateNote, deleteNote, searchNotes } = useNotes();
  
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreatingNote(true);
    setActiveView('editor');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreatingNote(false);
    setActiveView('editor');
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote = createNote(noteData);
    setSelectedNote(newNote);
    setIsCreatingNote(false);
  };

  const getDisplayedNotes = () => {
    if (activeView.startsWith('folder-')) {
      const folderId = activeView.replace('folder-', '');
      return notes.filter(note => note.folderId === folderId);
    }
    return notes;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard notes={notes} onCreateNote={handleCreateNote} />;
      
      case 'notes':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
              <button
                onClick={handleCreateNote}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                New Note
              </button>
            </div>
            <NoteList
              notes={getDisplayedNotes()}
              onSelectNote={handleSelectNote}
              selectedNoteId={selectedNote?.id}
            />
          </div>
        );
      
      case 'search':
        return (
          <SearchView
            notes={notes}
            onSelectNote={handleSelectNote}
            onSearch={searchNotes}
          />
        );
      
      case 'editor':
        return (
          <NoteEditor
            note={isCreatingNote ? null : selectedNote}
            folders={folders}
            onSave={handleSaveNote}
            onUpdate={updateNote}
          />
        );
      
      case 'ai-tools':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Smart Summarization</h3>
                <p className="text-gray-600 text-sm mb-4">Get AI-powered summaries of your notes</p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                  Coming Soon
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Semantic Search</h3>
                <p className="text-gray-600 text-sm mb-4">Find notes by meaning, not just keywords</p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                  Coming Soon
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Linking</h3>
                <p className="text-gray-600 text-sm mb-4">Automatically connect related notes</p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        if (activeView.startsWith('folder-')) {
          const folderId = activeView.replace('folder-', '');
          const folder = folders.find(f => f.id === folderId);
          return (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{folder?.name} Notes</h2>
                <button
                  onClick={handleCreateNote}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  New Note
                </button>
              </div>
              <NoteList
                notes={getDisplayedNotes()}
                onSelectNote={handleSelectNote}
                selectedNoteId={selectedNote?.id}
              />
            </div>
          );
        }
        return <Dashboard notes={notes} onCreateNote={handleCreateNote} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        folders={folders}
        activeView={activeView}
        onViewChange={setActiveView}
        onCreateNote={handleCreateNote}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;