import React, { useState, useEffect } from 'react';
import {
  Play,
  Download,
  Trash2,
  Calendar,
  Clock,
  BarChart3,
  Filter,
  Search,
  SortAsc,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRecordings } from '../lib/hooks/useRecordings';
import { useAuth } from '../App';
import { format, parseISO } from 'date-fns';

type SortField = 'date' | 'duration' | 'score';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'technical' | 'behavioral' | 'general';

function Recordings() {
  const { user } = useAuth();
  const { recordings, loading, error, deleteRecording } = useRecordings();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate storage usage
  const totalStorage = 6 * 1024 * 1024 * 1024; // 6GB in bytes
  const usedStorage = recordings.reduce((total, recording) => {
    // Estimate video size based on duration (rough estimate)
    const durationInSeconds = recording.duration ? 
      parseInt(recording.duration.match(/(\d+):(\d+):(\d+)/)?.[1] || '0') * 3600 +
      parseInt(recording.duration.match(/(\d+):(\d+):(\d+)/)?.[2] || '0') * 60 +
      parseInt(recording.duration.match(/(\d+):(\d+):(\d+)/)?.[3] || '0') : 0;
    
    return total + (durationInSeconds * 1.5 * 1024 * 1024); // Roughly 1.5MB per second
  }, 0);

  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(recording => {
      const matchesSearch = recording.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || recording.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortField === 'score') {
        return sortOrder === 'desc'
          ? (b.score || 0) - (a.score || 0)
          : (a.score || 0) - (b.score || 0);
      }
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteRecording(id);
    } catch (error) {
      console.error('Error deleting recording:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true);
      await Promise.all(selectedRecordings.map(id => deleteRecording(id)));
      setSelectedRecordings([]);
    } catch (error) {
      console.error('Error deleting recordings:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRecordings.length === filteredRecordings.length) {
      setSelectedRecordings([]);
    } else {
      setSelectedRecordings(filteredRecordings.map(r => r.id));
    }
  };

  const toggleRecordingSelection = (id: string) => {
    setSelectedRecordings(prev =>
      prev.includes(id)
        ? prev.filter(recordingId => recordingId !== id)
        : [...prev, id]
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load recordings</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recorded Interviews</h1>
        <p className="text-muted-foreground mt-2">
          Review and analyze your past interview sessions
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recordings..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary"
            />
          </div>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="px-4 py-2 rounded-lg bg-secondary"
        >
          <option value="all">All Types</option>
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="general">General</option>
        </select>
        <button
          onClick={() => handleSort('date')}
          className="px-4 py-2 rounded-lg bg-secondary flex items-center gap-2"
        >
          <SortAsc className="h-4 w-4" />
          {sortField === 'date' ? (sortOrder === 'asc' ? 'Oldest' : 'Newest') : 'Sort by Date'}
        </button>
      </div>

      {/* Recordings List */}
      <div className="bg-secondary rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredRecordings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recordings found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <div
                key={recording.id}
                className="bg-background rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedRecordings.includes(recording.id)}
                    onChange={() => toggleRecordingSelection(recording.id)}
                    className="h-4 w-4 rounded border-secondary"
                  />
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{recording.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(recording.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recording.duration}</span>
                      </div>
                      {recording.score && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{recording.score}%</span>
                        </div>
                      )}
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        {recording.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {recording.video_url && (
                    <a
                      href={recording.video_url}
                      download
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(recording.id)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg hover:bg-accent transition-colors text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
          <div className="space-y-4">
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(usedStorage / totalStorage) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {(usedStorage / (1024 * 1024 * 1024)).toFixed(1)} GB used
              </span>
              <span className="text-muted-foreground">
                {(totalStorage / (1024 * 1024 * 1024)).toFixed(1)} GB total
              </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recording Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Recordings</p>
              <p className="text-2xl font-semibold">{recordings.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="text-2xl font-semibold">
                {(recordings.reduce((total, recording) => {
                  const duration = recording.duration?.match(/(\d+):(\d+):(\d+)/);
                  if (!duration) return total;
                  return total + parseInt(duration[1]) * 60 + parseInt(duration[2]);
                }, 0) / 60).toFixed(1)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-semibold">
                {Math.round(
                  recordings.reduce((total, r) => total + (r.score || 0), 0) /
                    recordings.filter(r => r.score).length
                )}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-semibold">
                {Math.max(...recordings.map(r => r.score || 0))}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 rounded-lg bg-secondary"
          >
            {selectedRecordings.length === filteredRecordings.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          {selectedRecordings.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-secondary text-red-500 disabled:opacity-50"
            >
              Delete Selected ({selectedRecordings.length})
            </button>
          )}
        </div>
        {selectedRecordings.length > 0 && (
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
            Download Selected
          </button>
        )}
      </div>
    </div>
  );
}

export default Recordings;