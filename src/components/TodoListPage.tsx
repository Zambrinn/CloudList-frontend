import { useState, useEffect } from "react";
import api from "../services/api";

interface Todo {
    id: string; // Converte automaticamente UUID -> String
    description: string;
    done: boolean;
}

export function TodoListPage() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        api.get('/todos')
        .then(response => {
            setTodos(response.data);
        })
        .catch(error => {
            console.error("Falha ao buscar tarefas: ", error);
            alert("Você precisa estar logado para ver suas tarefas.");
        });
    }, []);

    return (
        <div>
            <h1> Minhas tarefas </h1>

            <ul>
                {todos.length > 0 ? (
                    todos.map(todo => <li key={todo.id}> {todo.description} </li>)
                ) : (
                    <p> Nenhuma tarefa encontrada. Adicione uma nova!</p>
                )}
            </ul>
        </div>
    );
}