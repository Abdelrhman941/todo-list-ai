
import React from 'react';
import { ViewMode, Category } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CalendarDays, 
  List, 
  CheckCircle, 
  Plus,
  TrendingUp,
  Target,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onCreateTask: () => void;
  taskStats: {
    total: number;
    completed: number;
    overdue: number;
    today: number;
    completionRate: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  setViewMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  onCreateTask,
  taskStats
}) => {
  const views = [
    { id: 'today' as ViewMode, label: 'Today', icon: Calendar, count: taskStats.today },
    { id: 'week' as ViewMode, label: 'This Week', icon: CalendarDays, count: 0 },
    { id: 'all' as ViewMode, label: 'All Tasks', icon: List, count: taskStats.total - taskStats.completed },
    { id: 'completed' as ViewMode, label: 'Completed', icon: CheckCircle, count: taskStats.completed },
  ];

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-6">
      {/* Create Task Button */}
      <Button onClick={onCreateTask} className="w-full" size="lg">
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Button>

      {/* Quick Stats */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {Math.round(taskStats.completionRate)}%
            </Badge>
          </div>
          <Progress value={taskStats.completionRate} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              <span>{taskStats.completed} completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>{taskStats.today} due today</span>
            </div>
          </div>
          {taskStats.overdue > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertTriangle className="h-3 w-3" />
              <span>{taskStats.overdue} overdue tasks</span>
            </div>
          )}
        </div>
      </Card>

      {/* Views */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Views</h3>
        {views.map(view => (
          <Button
            key={view.id}
            variant={viewMode === view.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-between h-9",
              viewMode === view.id && "bg-blue-100 text-blue-700 hover:bg-blue-100"
            )}
            onClick={() => setViewMode(view.id)}
          >
            <div className="flex items-center gap-2">
              <view.icon className="h-4 w-4" />
              <span>{view.label}</span>
            </div>
            {view.count > 0 && (
              <Badge variant="outline" className="ml-auto bg-white/50">
                {view.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
        <Button
          variant={selectedCategory === '' ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start h-9",
            selectedCategory === '' && "bg-blue-100 text-blue-700 hover:bg-blue-100"
          )}
          onClick={() => setSelectedCategory('')}
        >
          All Categories
        </Button>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-9",
              selectedCategory === category.name && "bg-blue-100 text-blue-700 hover:bg-blue-100"
            )}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
