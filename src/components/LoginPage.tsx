import { useState, type   FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';

export function LoginPage() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    try {
      console.log("Tentando logar com:", { username, password });
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.token;
      
      localStorage.setItem('authToken', token);
      
      navigate('/'); 

    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
              Usuário
            </label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
              Senha
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}