import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { TodoListPage } from './components/TodoListPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/">Minhas Tarefas</Link></li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<TodoListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;