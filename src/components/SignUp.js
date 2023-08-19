import React from 'react'
import { Link } from 'react-router-dom';
import { useSignUp } from '../hooks/useSignup';

function SignUp() {
    const { signup, loading, error } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        await signup(data);
    }
    return (
        <form className='auth-form' onSubmit={handleSubmit} method='post' encType='multipart/form-data'>
            <h2 className='page-title'>Sign Up to Start Matching</h2>
            {error && <p className='error'><small>{error}</small></p>}
            {error && window.scrollTo({ top: 100, left: 0, behavior: 'smooth' })}
            <input type='text' name='firstName' placeholder="First Name" required />
            <input type='text' name='lastName' placeholder='Last Name' />
            <input
                type='text'
                name='birthDate'
                placeholder='Date of birth'
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                required
            />
            <input type='file' name='photo' accept='image/*' placeholder='Photo' required />
            <input type='text' name='bio' placeholder='Bio' />
            <select name="gender" required>
                <option value="">--Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <select name="lookingFor">
                <option value="">--Looking For--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input type='text' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='password' name='confirmPassword' placeholder='Confirm password' required />
            {!loading && <button className='btn'>Sign Up</button>}
            {loading && <button className='btn' disabled>Loading...</button>}
            <p className='login-switch'>Already have an account?
                <Link to="/login"> Login</Link>
            </p>
        </form>
    )
}

export default SignUp