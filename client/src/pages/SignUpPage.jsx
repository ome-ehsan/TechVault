import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'

const SignUpPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
    <h1 className="text-3xl font-bold">Sign Up</h1>
  </div>
  )
}

export default SignUpPage