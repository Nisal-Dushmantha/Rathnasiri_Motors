import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import background1 from '../uploads/background1.mp4';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log({ email, username, password, confirmPassword, phone, otp });
    // TODO: Add registration logic here
  };

  const sendOtp = () => {
    // TODO: Implement OTP sending
    alert(`OTP sent to ${phone}`);
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
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Create Account</h1>
        <p className="text-gray-700 mb-6">Fill in your details to register</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Phone number + Send OTP button */}
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={sendOtp}
              className="bg-green-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-green-500 transition duration-300"
            >
              Send OTP
            </button>
          </div>

          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full bg-blue-800 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/Login" className="text-blue-800 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
