import React from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  Folder, 
  Settings, 
  BarChart3,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Folder as FolderType } from '../../types';

interface SidebarProps {
  folders: FolderType[];
  activeView: string;
  onViewChange: (view: string) => void;
  onCreateNote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeView,
  onViewChange,
  onCreateNote
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notes', label: 'All Notes', icon: BookOpen },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">NoteAI</h1>
        <p className="text-sm text-gray-600 mt-1">Your AI Knowledge Base</p>
      </div>
      
      <div className="p-4">
        <button
          onClick={onCreateNote}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-3">
            Folders
          </h3>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onViewChange(`folder-${folder.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === `folder-${folder.id}`
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Folder size={18} style={{ color: folder.color }} />
                {folder.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};