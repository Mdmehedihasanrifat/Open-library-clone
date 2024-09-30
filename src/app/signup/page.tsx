"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      alert('user created')
      router.push('/login')
      if (!res.ok) {
        throw new Error('Signup failed');
      }

      const data = await res.json();

      // Save the JWT token to localStorage or cookie (as per your auth strategy)
      localStorage.setItem('token', data.token);

      // Redirect to the homepage or a protected route after successful signup
      router.push('/');
    } catch (error) {
      setError('Unable to sign up. Please try again.');
    }
  };

  return (
    <div className='mt-[20vh]'>
        
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>

      </form>
    </div>
    </div>
  );
};

export default SignupPage;
