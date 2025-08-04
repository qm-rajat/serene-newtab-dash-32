import { useState, useEffect } from 'react';
import { Plus, Check, X, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const TodoWidget = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-success/20">
          <CheckSquare className="w-5 h-5 text-success" />
        </div>
        <h3 className="font-semibold text-card-foreground">To-Do List</h3>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a task..."
          className="flex-1 bg-secondary/50 border-glass-border"
        />
        <Button
          onClick={addTodo}
          size="icon"
          className="flex-shrink-0 bg-success hover:bg-success/80"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {todos.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No tasks yet. Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center space-x-2 p-2 rounded-lg glass-hover transition-all ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 ${
                  todo.completed 
                    ? 'text-success hover:text-success/80' 
                    : 'text-muted-foreground hover:text-success'
                }`}
              >
                <Check className="w-4 h-4" />
              </Button>
              <span
                className={`flex-1 text-sm ${
                  todo.completed 
                    ? 'line-through text-muted-foreground' 
                    : 'text-card-foreground'
                }`}
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 w-6 h-6 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};