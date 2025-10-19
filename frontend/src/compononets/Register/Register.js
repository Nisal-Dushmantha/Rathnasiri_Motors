import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background1 from '../uploads/background1.mp4';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    // Confirm Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        Email: email,
        Name: username,
        Password: password,
        Number: phone,
      });

      if (response.status === 200) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background video to match Login */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={background1} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-900/50" />

      {/* Go Back button (top-left) */}
      <Link to="/" className="fixed top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/15 text-white border border-white/30 backdrop-blur px-3 py-1.5 hover:bg-white/25">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Go back</span>
      </Link>

      {/* Minimal header like Login */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between text-white/90">
          <div className="text-lg font-semibold tracking-wide">Rathnasiri Motors</div>
        </div>
      </header>

      {/* Centered glass card */}
      <div className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/15 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-white">
          <div className="relative mb-6">
            <h2 className="text-2xl font-semibold text-center">Create account</h2>
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

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Full name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Phone number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0771234567"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Password</label>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Confirm password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/15 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-semibold shadow-lg transition disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-white/90">
            Already have an account?{' '}
            <Link to="/Login" className="font-semibold underline underline-offset-2 hover:text-white">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
