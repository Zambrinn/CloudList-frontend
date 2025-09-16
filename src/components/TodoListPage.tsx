import { useState, useEffect, type FormEvent } from 'react';
import api from '../services/api';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>
);

interface Todo { id: string; description: string; done: boolean; }

export function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoText, setEditingTodoText] = useState('');

  function fetchTodos() {
    api.get('/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error("Falha ao buscar to-dos:", error))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => { fetchTodos(); }, []);

  async function handleAddTodo(event: FormEvent) {
    event.preventDefault();
    if (!newTodoDescription.trim()) return;
    try {
      const response = await api.post('/todos', {
        description: newTodoDescription,
        done: false,
      });
      setTodos(currentTodos => [...currentTodos, response.data]);
      setNewTodoDescription('');
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  }

  async function handleToggleTodo(id: string, currentStatus: boolean) {
    const originalTodos = [...todos];
    setTodos(currentTodos => currentTodos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
    try {
      const todoToUpdate = originalTodos.find(todo => todo.id === id);
      if (todoToUpdate) {
        await api.put(`/todos/${id}`, {
          description: todoToUpdate.description,
          done: !currentStatus,
        });
      }
    } catch (error) {
      console.error("Falha ao sincronizar o update:", error);
      setTodos(originalTodos);
    }
  }

  async function handleDeleteTodo(id: string) {
    const originalTodos = [...todos];
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setTodos(originalTodos);
    }
  }

  function handleEditClick(todo: Todo) {
    setEditingTodoId(todo.id);
    setEditingTodoText(todo.description);
  }

  function handleCancelEdit() {
    setEditingTodoId(null);
    setEditingTodoText('');
  }
  
  async function handleSaveEdit(id: string) {
    if (!editingTodoText.trim()) return;
    const originalTodos = [...todos];
    setTodos(currentTodos => currentTodos.map(todo => todo.id === id ? { ...todo, description: editingTodoText } : todo));
    setEditingTodoId(null);
    try {
      const todoToUpdate = originalTodos.find(todo => todo.id === id);
      if(todoToUpdate) {
        await api.put(`/todos/${id}`, {
          description: editingTodoText,
          done: todoToUpdate.done,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      setTodos(originalTodos);
    }
  }
  
  return (
    <div className="flex items-start justify-center">
      <div className="w-full max-w-2xl bg-gradient-to-br from-zinc-950/70 to-zinc-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
            Today's Tasks
          </h1>
        </header>

        <form onSubmit={handleAddTodo} className="mb-8 relative">
          <input 
            type="text"
            value={newTodoDescription}
            onChange={e => setNewTodoDescription(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 border-2 border-zinc-800 rounded-lg p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] transition"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all bg-gradient-to-r from-zinc-300 to-zinc-100 text-zinc-900 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:opacity-90"
            aria-label="Add task"
          >
            <PlusIcon />
          </button>
        </form>

        <div className="space-y-3">
          {isLoading ? ( <p className="text-zinc-500 text-center">Loading tasks...</p> ) 
          : todos.map(todo => (
              <div key={todo.id} className="group flex items-center gap-4 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 hover:border-white/40 transition-colors">
                
                <button onClick={() => handleToggleTodo(todo.id, todo.done)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-300 ${todo.done ? 'bg-gradient-to-r from-zinc-300 to-zinc-100 border-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]' : 'border-zinc-700 group-hover:border-white/60'}`}>
                  {todo.done && <span className="text-zinc-900 text-xs">✓</span>}
                </button>
                
                {editingTodoId === todo.id ? (
                  <input
                    type="text"
                    value={editingTodoText}
                    onChange={(e) => setEditingTodoText(e.target.value)}
                    onBlur={() => handleSaveEdit(todo.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                    autoFocus
                    className="flex-grow bg-transparent text-zinc-100 focus:outline-none"
                  />
                ) : (
                  <p className={`flex-grow text-zinc-100 transition-colors ${todo.done ? 'line-through text-zinc-500' : ''}`}>
                    {todo.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(todo)} className="text-zinc-500 hover:text-zinc-100 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"><EditIcon /></button>
                  <button onClick={() => handleDeleteTodo(todo.id)} className="text-zinc-500 hover:text-red-500"><TrashIcon /></button>
                </div>

              </div>
          ))}

          {!isLoading && todos.length === 0 && (
             <p className="text-zinc-500 text-center py-8">No tasks yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
