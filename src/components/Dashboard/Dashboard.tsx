import React from 'react';
import { 
  FileText, 
  Tag, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Note, AnalyticsData } from '../../types';

interface DashboardProps {
  notes: Note[];
  onCreateNote: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ notes, onCreateNote }) => {
  const analytics: AnalyticsData = {
    totalNotes: notes.length,
    notesThisWeek: notes.filter(note => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(note.createdAt) > weekAgo;
    }).length,
    mostUsedTags: notes
      .flatMap(note => note.tags)
      .reduce((acc: { [key: string]: number }, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {}),
    recentActivity: notes
      .slice(0, 5)
      .map(note => ({
        date: note.updatedAt,
        action: 'Updated',
        noteTitle: note.title || 'Untitled Note'
      }))
  };

  const topTags = Object.entries(analytics.mostUsedTags)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentNotes = notes.slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome to your AI-powered knowledge base</p>
        </div>
        
        <button
          onClick={onCreateNote}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Sparkles size={18} />
          Quick Note
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalNotes}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.notesThisWeek}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tags Used</p>
              <p className="text-2xl font-bold text-gray-900">{topTags.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {note.title || 'Untitled Note'}
                  </h4>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {note.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag size={12} />
                        {note.tags.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Top Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Popular Tags</h3>
            </div>
            <div className="p-6 space-y-3">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                    {tag}
                  </span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Sparkles className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">AI Summary</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">Weekly Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};