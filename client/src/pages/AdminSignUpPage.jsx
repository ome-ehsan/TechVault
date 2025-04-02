import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { Eye, EyeOff } from 'lucide-react'
import { hashKey } from '../libs/hashKey'

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        adminKey : ""
    });
    const { signUp, isSigning } = useAuthStore();

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Full name is required");
            return false;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Invalid email format");
            return false;
        }
        if (!formData.password) {
            toast.error("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (!formData.phone.trim()) {
            toast.error("Phone is required");
            return false;
        }
        if (formData.phone.length < 11) {
            toast.error("Phone No. must be 11 digits or more");
            return false;
        }
        if (!formData.adminKey.trim()) {
            toast.error("Admin Key is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        //formData.adminKey = await hashKey(formData.adminKey);
        await signUp({ ...formData,role:"admin", adminKey: await hashKey(formData.adminKey)});
    };

    // const handleHash = async (e)=>{
    //     const hashedKey = await hashKey(e.target.value);
    // }

    return (
        <div className="min-h-screen bg-gray-900 pt-40"> {/* Padding for fixed navbar */}
            <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                    Admin Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Jack Hanma"
                        />
                    </div>

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

                    <div>
                        <label className="block text-gray-300 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="01XXXXXXXXX"
                            pattern="[0-9]{11,}"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Admin Key</label>
                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={formData.adminKey}
                                onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                            >
                                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSigning}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSigning ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Already have an account? {' '}
                    <Link
                        to="/login"
                        className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage