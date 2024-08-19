import React from 'react';
import axios from 'axios';

function Login({ setToken }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = event.target.elements;

        try {
            const response = await axios.post('http://localhost:5183/api/Auth/login', {
                username: username.value,
                password: password.value,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            setToken(token);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            Username<input type="text" name="username" /><br/>
            Password<input type="password" name="password" /><br/>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
