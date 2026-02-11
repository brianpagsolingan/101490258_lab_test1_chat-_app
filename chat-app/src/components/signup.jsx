import React, {useState, useEffect, useRef} from 'react';
import {signup} from '../api/auth';

export default function Signup({onSignup}){
    const [form, setForm] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) =>setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const res = await signup(form);
            if(res.data.message) onSignup(form.username);
        }catch(err){
            setError(err.response.data.message || 'Signup failed');
        }
    };
    return(
        <div className="container mt-5">
            <h2>Signup</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" required name="username" value={form.username} onChange={handleChange} placeholder="Username" className="form-control mb-2" />
                <input type="password" required name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-control mb-2" />
                <input type="text" requiredname="firstname" value={form.firstname} onChange={handleChange} placeholder="Firstname" className="form-control mb-2" />
                <input type="text" required name="lastname" value={form.lastname} onChange={handleChange} placeholder="Lastname" className="form-control mb-2" />
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    );
}