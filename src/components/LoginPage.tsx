import { useState, type FormEvent, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    try {
      await signIn({ username, password });
      
      toast.success('Login bem-sucedido!'); 
      navigate('/'); 
    } catch (err) {
      toast.error("Falha no login. Verifique o usuário e a senha.");
      console.error("Erro no login:", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-zinc-950/70 to-zinc-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
            Welcome Back
          </h1>
          <p className="text-zinc-400">Please sign in to continue</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-zinc-300">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 border-2 border-zinc-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] transition"/>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-zinc-300">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 border-2 border-zinc-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] transition"/>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-zinc-300 to-zinc-100 text-zinc-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] hover:opacity-90">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] hover:opacity-90">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
