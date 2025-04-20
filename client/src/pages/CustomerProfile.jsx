import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Phone, User, Mail, Heart, Star, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../libs/axios';

const CustomerProfile = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser.name || '',
    phone: authUser.phone || '',
    address: authUser.addresses?.[0] || {
      street: '',
      city: '',
      country: '',
      zipCode: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'country', 'zipCode'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/auth/profile/update', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setAuthUser(res.data.updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-[#1E1E2E] rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
          <User size={28} /> My Profile
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span className="text-gray-300">{authUser.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Star size={20} />
            <span className="capitalize">{authUser.loyaltyLevel} Member</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart size={20} />
            <span>{authUser.wishlist?.length || 0} items in wishlist</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-2">Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.address.street}
                onChange={handleChange}
                className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleChange}
                className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleChange}
                className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
