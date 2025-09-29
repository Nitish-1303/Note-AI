import React, { useState } from 'react';
import { Search, Filter, Sparkles, Hash } from 'lucide-react';
import { Note } from '../../types';
import { NoteList } from '../Notes/NoteList';

interface SearchViewProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onSearch: (query: string) => Note[];
}

export const SearchView: React.FC<SearchViewProps> = ({
  notes,
  onSelectNote,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>(notes);
  const [searchType, setSearchType] = useState<'all' | 'content' | 'tags'>('all');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults(notes);
      return;
    }

    let filteredNotes = onSearch(searchQuery);
    
    // Additional filtering based on search type
    if (searchType === 'content') {
      filteredNotes = filteredNotes.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === 'tags') {
      filteredNotes = filteredNotes.filter(note =>
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setResults(filteredNotes);
  };

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Search Notes</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
            <Sparkles size={18} />
            AI Search
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search notes by title, content, or tags..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Search Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Search in:</span>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'content', label: 'Content' },
              { value: 'tags', label: 'Tags' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSearchType(type.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  searchType === type.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tag Search */}
      {!query && allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Hash size={16} />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        {query && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {results.length} note{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        )}
        
        <NoteList
          notes={results}
          onSelectNote={onSelectNote}
        />
      </div>
    </div>
  );
};