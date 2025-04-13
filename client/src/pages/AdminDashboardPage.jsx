import React, { useEffect, useState } from 'react';
import {axiosInstance} from "../libs/axios"
import toast from 'react-hot-toast';
import {
  Package, Pencil, Save, Trash2, Users
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/product/search');
        setProducts(res.data.products);
      } catch (err) {
        toast.error('Failed to fetch products');
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch customers
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const res = await axiosInstance.get('/api/users'); // assume route exists
  //       setCustomers(res.data.users);
  //     } catch (err) {
  //       toast.error('Failed to fetch customers');
  //       console.error(err);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);

  const handleEditClick = (product) => {
    setEditProductId(product._id);
    setEditedProduct({
      price: product.price,
      quantity: product.quantity,
      warranty: product.warranty
    });
  };

  const handleSaveClick = (productId) => {
    toast.success('Changes saved');
    setEditProductId(null);
  };

  // const handleCustomerDelete = async (userId) => {
  //   try {
  //     await axiosInstance.delete(`/api/users/${userId}`);
  //     setCustomers(customers.filter(c => c._id !== userId));
  //     toast.success('Customer deleted');
  //   } catch (err) {
  //     toast.error('Failed to delete customer');
  //   }
  // };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-6 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Admin Dashboard</h1>

      {/* Product Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Package size={24} />
          <h2 className="text-xl font-semibold">Manage Products</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-gray-800 rounded-lg">
            <thead className="bg-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Warranty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{prod.name}</td>
                  <td className="px-4 py-3">
                    {editProductId === prod._id ? (
                      <input
                        type="number"
                        value={editedProduct.price}
                        onChange={e => setEditedProduct({ ...editedProduct, price: e.target.value })}
                        className="bg-gray-700 px-2 py-1 rounded text-white w-24"
                      />
                    ) : (
                      `৳${prod.price}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editProductId === prod._id ? (
                      <input
                        type="number"
                        value={editedProduct.quantity}
                        onChange={e => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                        className="bg-gray-700 px-2 py-1 rounded text-white w-20"
                      />
                    ) : (
                      prod.quantity
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editProductId === prod._id ? (
                      <input
                        type="number"
                        value={editedProduct.warranty}
                        onChange={e => setEditedProduct({ ...editedProduct, warranty: e.target.value })}
                        className="bg-gray-700 px-2 py-1 rounded text-white w-16"
                      />
                    ) : (
                      `${prod.warranty} yrs`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editProductId === prod._id ? (
                      <button
                        onClick={() => handleSaveClick(prod._id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Save size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(prod)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={24} />
          <h2 className="text-xl font-semibold">Manage Customers</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-gray-800 rounded-lg">
            <thead className="bg-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(cust => (
                <tr key={cust._id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{cust.name}</td>
                  <td className="px-4 py-3">{cust.email}</td>
                  <td className="px-4 py-3">{cust.phone}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCustomerDelete(cust._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
