import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await api.post('/auth/register', { username, password });

      toast.success('Usuário registrado com sucesso! Faça o login.');
      navigate('/login'); 

    } catch (error) {
      console.error("Erro no registro:", error);
      toast.error('Falha no registro. Tente outro nome de usuário.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-zinc-950/70 to-zinc-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
            Create Account
          </h1>
          <p className="text-zinc-400">Join us and start organizing your tasks</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-zinc-300">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 border-2 border-zinc-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] transition" required/>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-zinc-300">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 border-2 border-zinc-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] transition" required/>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-zinc-300 to-zinc-100 text-zinc-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] hover:opacity-90">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-medium bg-gradient-to-r from-zinc-300 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] hover:opacity-90">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
