import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background1 from '../uploads/background1.mp4';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/register/login', {
        Email: email,
        Password: password,
      });
      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/homepage');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={background1} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 -z-5"></div>

      {/* Center card */}
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center z-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome Back!</h1>
        <p className="text-gray-700 mb-6">
          Please login to continue
        </p>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Password input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/Register" className="text-blue-800 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>

      
    </div>
  );
}

export default Login;
