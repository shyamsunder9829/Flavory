import React from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

const UserLogin = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/login", {
        email,
        password
      }, { withCredentials: true });

      console.log(response.data);

      // persist token and set default Authorization header
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      navigate("/home"); // Redirect to home after login
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      alert(serverMessage || 'Login failed');
      console.error('Login error:', err);
    }

  };

  return (
    <div className="auth-page-wrapper">
      <BackButton />
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;