import React from "react";
import { useState } from "react";


export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
            })
            const data = await response.json();
            console.log(data);
            if (response.ok === true) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
            }
            else if (response.ok === false) {
                setError(data.error || "Something went wrong! " + response.status);
            }
        }
        catch (error) {
            setError(error.message);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ email, password, username: userName })
            })
            const data = await response.json();
            console.log(data);
            if (response.ok === true) {
                alert("Реєстрація успішна!");
            }
            else if (response.ok === false) {
                setError(data.error || "Something went wrong!" + response.status);
            }
        }
        catch (error) {
            setError(error.message);
        }
    }
    return (
        <form>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input value={userName} onChange={e => setUserName(e.target.value)} type="text" placeholder="User name" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button type="submit" onClick={handleLogin}>Login</button>
            <button type="submit" onClick={handleRegister}>Register</button>
        </form>
    );
}
