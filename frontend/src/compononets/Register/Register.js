import React from 'react'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <div>
      <Link to="/Login"><button className="ml-6 bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Login</button></Link>
    </div>
  )
}

export default Register
