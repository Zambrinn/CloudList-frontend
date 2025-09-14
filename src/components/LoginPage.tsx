import { useState, type FormEvent, use} from "react";
import api from "../services/api";

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(event: FormEvent) {
        event.preventDefault();

        try {
            console.log("Tentando logar com: ", {username, password});

            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            const token = response.data.token;
            console.log("Login deu certo: ", token);

            localStorage.setItem('authToken', token);
            alert("Login realizado com sucesso.");
        } catch (error) {
            console.log("Deu erro no login: ", error);
            alert("Falhou no login. Verifique suas credenciais.")
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div> 
                    <label htmlFor="username">User: </label>
                    <input type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}/>
                </div>
                 <div>
                        <label htmlFor="password"></label>
                        <input type="text"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit"> Entrar</button>
            </form>
        </div>
    )
}