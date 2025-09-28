import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background1 from '../uploads/background1.mp4';
import { User, Lock, LogIn, Eye, EyeOff, AlertTriangle, CheckCircle, CarFront } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
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
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background video with overlay */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={background1} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-950/90"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-md">
              <CarFront className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Welcome Back</h1>
          <p className="text-white/90 text-lg">Sign in to your Rathnasiri Motors account</p>
        </div>
        
        <div className="bg-white/95 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:shadow-blue-500/10">
          {/* Alert messages */}
          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-center border-l-4 border-red-500 shadow-sm animate-fade-in">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-700 rounded-lg p-4 mb-6 flex items-center border-l-4 border-green-500 shadow-sm animate-fade-in">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span>Email Address</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="pl-10 w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-blue-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span>Password</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 w-full pr-10 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-blue-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                onClick={() => alert('Password reset functionality will be available soon!')}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/Register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
