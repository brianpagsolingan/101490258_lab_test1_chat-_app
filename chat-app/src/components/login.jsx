import React from "react";
import { useState } from "react";
import { login } from "../api/auth";

export default function Login({ onLogin }) {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            if (res.data.message) onLogin(form.username);
        } catch (err) {
            setError(err.response.data.message || 'Login failed');
        }
    };

    return(
        <div className="container mt-5">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" required name="username" value={form.username} onChange={handleChange} placeholder="Username" className="form-control mb-2" />
                <input type="password" required name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-control mb-2" />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>  
    )
}