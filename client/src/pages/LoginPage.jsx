import React from 'react'
import { useState } from 'react'
import { Link} from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLogging } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-40"> {/* Padding for fixed navbar */}
            <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                    Log in to TechVault
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="jackHanma@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLogging}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLogging ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Don't have an account? {' '} 
                    <Link
                        to="/signup"
                        className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                        Sign Up here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;