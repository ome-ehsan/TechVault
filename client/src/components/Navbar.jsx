import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Bell, User, LockKeyhole, ShoppingCart, Heart, LayoutDashboard, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // customer lnks
  const customerLinks = [
    { path: '/cart', name: 'Cart', icon: <ShoppingCart size={20} /> },
    { path: '/wishlist', name: 'Wishlist', icon: <Heart size={20} /> },
    { path: '/products', name: 'Products', icon: <Package size={20} /> },
  ];
  // admin links
  const adminLinks = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', name: 'Products', icon: <Package size={20} /> },
    { path: '/admin/users', name: 'Users', icon: <Users size={20} /> },
  ];

  return (
    <nav className="bg-[#1E1E2E] shadow-md fixed w-full z-10 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side Logo*/}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400">TechVault</span>
          </Link>

          {/* Right side Navigation */}
          <div className="flex items-center gap-6">
            {authUser ? (
              <>
                {/* Role-based links */}
                <div className="hidden md:flex items-center gap-4">
                  {authUser.role === 'customer' && customerLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}

                  {authUser.role === 'admin' && adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}

                  {/* Notification*/}
                  <button
                    onClick={() => toast('No new notifications')}
                    className="relative text-gray-300 hover:text-cyan-400"
                  >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-cyan-400"
                  >
                    <User size={20} />
                    <span>{authUser.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#2A2A3A] rounded-md shadow-lg py-2 border border-gray-600">
                      <Link
                        to={authUser.role === 'admin' ? '/admin/profile' : '/profile'}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                      >
                        <LockKeyhole size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not logged in 
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-400"
                >
                  <LockKeyhole size={20} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-400"
                >
                  <User size={20} />
                  Sign Up
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-400"
                >
                  <LayoutDashboard size={20} />
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
