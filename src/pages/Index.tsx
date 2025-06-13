
import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Sidebar';
import { TaskHeader } from '@/components/TaskHeader';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    tasks,
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
  } = useTasks();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  const taskStats = getTaskStats();

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      addTask(taskData);
      toast({
        title: "Task created",
        description: "Your new task has been added to your list.",
      });
    }
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTask(id);
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed!",
        description: task.completed ? 
          "The task has been moved back to your active list." : 
          "Great job! Keep up the productivity.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onCreateTask={handleCreateTask}
        taskStats={taskStats}
      />

      <div className="flex-1 flex flex-col">
        <TaskHeader
          viewMode={viewMode}
          sortMode={sortMode}
          setSortMode={setSortMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          taskCount={tasks.length}
        />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search or filters' 
                    : 'Create your first task to get started with productivity!'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleCreateTask}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create your first task
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="animate-fade-in">
                    <TaskCard
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
        categories={categories}
        task={editingTask}
      />
    </div>
  );
};

export default Index;
