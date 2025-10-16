// Consolidated Login Component with inline styles
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import background1 from "../uploads/background1.mp4"; // import video

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background video: place file at frontend/public/uploads/background1.mp4 */}
      <video
         autoPlay
         loop
         muted
         playsInline
         className="absolute inset-0 w-full h-full object-cover -z-10"
       >
         <source src={background1} type="video/mp4" />
       </video>


      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/50" />

      {/* Go Back button (top-left) */}
      <Link to="/" className="fixed top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/15 text-white border border-white/30 backdrop-blur px-3 py-1.5 hover:bg-white/25">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Go back</span>
      </Link>

      {/* Simple top nav to match style */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between text-white/90">
          <div className="text-lg font-semibold tracking-wide">Rathnasiri Motors</div>
        </div>
      </header>

      {/* Centered glass card */}
      <div className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/15 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-white">
          <div className="relative mb-6">
            <h2 className="text-2xl font-semibold text-center">Login</h2>
          </div>

          {/* Alerts adapted for dark card */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-red-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 text-emerald-100 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-white/90">Password</label>
                <button type="button" onClick={() => alert('Password reset coming soon')} className="text-xs text-white/80 hover:text-white">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white/60" />
                <span className="text-white/90">Remember me</span>
              </label>
              <span className="text-white/80">&nbsp;</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-semibold shadow-lg transition disabled:opacity-70">
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-white/90">
            Don’t have an account?{' '}
            <Link to="/Register" className="font-semibold underline underline-offset-2 hover:text-white">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
//nisal
export default Login;