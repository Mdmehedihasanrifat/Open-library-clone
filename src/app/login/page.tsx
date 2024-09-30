"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendURL } from '../config/backendurl';
import Cookies from "js-cookie"
import toast from 'react-hot-toast';
import { useUser } from '../components/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const {setUser}=useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${backendURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      Cookies.set("user",JSON.stringify(data.user))
      Cookies.set("token",data.token)
      setUser(data.user)

      toast.success("Login successfull.")
       // Dispatch a custom event to notify that the user has logged in
       const loginEvent = new CustomEvent('userLoggedIn', {
        detail: { user: data.user }, // You can send user info if needed
       });
       window.dispatchEvent(loginEvent);

      // Redirect to the homepage or a protected route
      router.push('/');
    } catch (error) {
        toast.error("Something wen wrong! Failed to login.")
      setError('Invalid email or password');
    }
  };

  return (
    <div className='mt-[25vh]'>

    <div className="login-container ">
      <h1 className='text-center'>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label className='block mb-5' htmlFor="email">Email:</label>
          <input
            className='border-solid p-8 mb-15 rounded-lg'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
