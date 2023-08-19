import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

function Login() {
    const { loading, error, login } = useLogin()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    }
    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2 className='page-title'>Login to Start Matching</h2>
            {error && <p className='error'><small>{error}</small></p>}

            <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' />

            <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Password' />
            {!loading && <button className='btn'>Login</button>}
            {loading && <button className='btn' disabled>Loading...</button>}
            <p className='login-switch'>Don't have an account yet?
                <Link to="/signup"> Sign Up</Link>
            </p>
        </form>
    )
}

export default Login