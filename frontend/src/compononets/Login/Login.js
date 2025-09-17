import React from 'react'
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <div className="flex items-center justify-center h-screen">
        <Link to="/Homepage"><button className="ml-6 bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Login</button></Link>
        <Link to="/Register"><button className="ml-6 bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Register</button></Link>
      </div>  
    </div>
  )
}

export default Login
