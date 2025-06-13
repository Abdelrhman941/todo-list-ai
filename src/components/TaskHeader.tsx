
import React from 'react';
import { ViewMode, SortMode } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SortAsc, Filter } from 'lucide-react';

interface TaskHeaderProps {
  viewMode: ViewMode;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  taskCount: number;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  viewMode,
  sortMode,
  setSortMode,
  searchQuery,
  setSearchQuery,
  taskCount
}) => {
  const getViewTitle = (mode: ViewMode) => {
    switch (mode) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'all': return 'All Tasks';
      case 'completed': return 'Completed';
      default: return 'Tasks';
    }
  };

  const getViewDescription = (mode: ViewMode) => {
    switch (mode) {
      case 'today': return 'Tasks due today and overdue';
      case 'week': return 'Tasks due in the next 7 days';
      case 'all': return 'All your active tasks';
      case 'completed': return 'Your completed tasks';
      default: return '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getViewTitle(viewMode)}
            </h1>
            <p className="text-gray-600 mt-1">
              {getViewDescription(viewMode)} • {taskCount} tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={sortMode} onValueChange={(value: SortMode) => setSortMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
