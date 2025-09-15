import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { TodoListPage } from './components/TodoListPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-200">

        <nav className="bg-gray-800 p-4 shadow-lg">
          <div className="container mx-auto">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/login" className="font-semibold text-white hover:text-sky-400 transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/" className="font-semibold text-white hover:text-sky-400 transition-colors duration-300">
                  Minhas Tarefas
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<TodoListPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;