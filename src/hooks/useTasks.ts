
import { useState, useEffect } from 'react';
import { Task, Category, ViewMode, SortMode } from '@/types/task';

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: '#3B82F6', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#10B981', icon: 'user' },
  { id: '3', name: 'Shopping', color: '#F59E0B', icon: 'shopping-cart' },
  { id: '4', name: 'Health', color: '#EF4444', icon: 'heart' },
  { id: '5', name: 'Learning', color: '#8B5CF6', icon: 'book' },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('ticktick-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('ticktick-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by view mode
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    switch (viewMode) {
      case 'today':
        filtered = tasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() <= today.getTime() && !task.completed;
        });
        break;
      case 'week':
        filtered = tasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate <= weekEnd && !task.completed;
        });
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'all':
        filtered = tasks.filter(task => !task.completed);
        break;
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      switch (sortMode) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length;
    const today = tasks.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      const todayDate = new Date();
      return taskDate.toDateString() === todayDate.toDateString() && !t.completed;
    }).length;

    return { total, completed, overdue, today, completionRate: total > 0 ? (completed / total) * 100 : 0 };
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    categories,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskStats,
  };
};
