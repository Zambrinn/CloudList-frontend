import { useState, useEffect, type FormEvent } from 'react';
import api from '../services/api';

interface Todo {
  id: string;
  description: string;
  done: boolean;
}

export function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State para indicar carregamento inicial


  useEffect(() => {
    api.get('/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("Falha ao buscar to-dos:", error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }, []);

  async function handleAddTodo(event: FormEvent) {
    event.preventDefault();
    if (!newTodoDescription.trim()) return;

    const tempTodo = { 
      id: Math.random().toString(), // ID temporário
      description: newTodoDescription, 
      done: false 
    };
    setTodos(currentTodos => [...currentTodos, tempTodo]);
    setNewTodoDescription('');

    try {
      const response = await api.post('/todos', {
        description: newTodoDescription,
        done: false,
      });
      setTodos(currentTodos => 
        currentTodos.map(todo => (todo.id === tempTodo.id ? response.data : todo))
      );
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Falha ao adicionar tarefa. Revertendo.");
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== tempTodo.id));
    }
  }

  async function handleToggleTodo(id: string) {
    const originalTodos = [...todos];

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );

    try {
      const todoToUpdate = originalTodos.find(todo => todo.id === id);
      if (todoToUpdate) {
        await api.put(`/todos/${id}`, {
          description: todoToUpdate.description,
          done: !todoToUpdate.done,
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


  return (
    <div>
      <h1 className="text-4xl font-bold text-sky-400 mb-6">Minhas Tarefas</h1>
      
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
        <input 
          type="text"
          value={newTodoDescription}
          onChange={e => setNewTodoDescription(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="flex-grow bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Adicionar
        </button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-500">Carregando tarefas...</p>
        ) : todos.length > 0 ? (
            todos.map(todo => (
              <div key={todo.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={todo.done}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 focus:ring-sky-600 cursor-pointer"
                  />
                  <span className={`ml-4 text-gray-300 ${todo.done ? 'line-through text-gray-500' : ''}`}>
                    {todo.description}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300"
                >
                  Deletar
                </button>
              </div>
            ))
        ) : (
            <p className="text-gray-500">Nenhuma tarefa encontrada. Adicione uma nova!</p>
        )}
      </div>
    </div>
  );
}