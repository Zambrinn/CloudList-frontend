import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { TodoListPage } from './components/TodoListPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast'; 

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { signed, signOut } = useContext(AuthContext);

  function handleLogout() {
    signOut();
    toast.success('Você foi desconectado.'); 
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-zinc-900 font-sans text-zinc-100">
      <Toaster position="top-right" reverseOrder={false} />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-zinc-900/70 via-zinc-900/40 to-zinc-900/70 backdrop-blur-md">
  <div className="container mx-auto flex justify-between items-center p-4">
    <Link
      to="/"
  className="text-lg md:text-xl font-bold bg-gradient-to-r from-zinc-700 to-zinc-300 bg-clip-text text-transparent"
    >
      CloudList
    </Link>
    <nav className="flex items-center gap-4">
      {signed ? (
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition-all text-white font-medium py-2 px-4 rounded-xl text-sm shadow-lg shadow-red-500/20"
        >
          Sair
        </button>
      ) : location.pathname === "/login" ? (
        <Link
          to="/register"
          className="text-sm font-semibold text-zinc-300 hover:text-purple-400 transition-colors"
        >
          Register
        </Link>
      ) : (
        <Link
          to="/login"
          className="text-sm font-semibold text-zinc-300 hover:text-purple-400 transition-colors"
        >
          Login
        </Link>
      )}
    </nav>
  </div>
</header>

      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<TodoListPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;