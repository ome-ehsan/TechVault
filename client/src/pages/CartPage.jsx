import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Trash2, Loader2, Plus, Minus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../libs/axios';

const CartPage = () => {
  const { authUser, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [updatedCart, setUpdatedCart] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      await checkAuth();
      setLoading(false);
    };
    loadUser();
  }, [checkAuth]);

  useEffect(() => {
  
    if (authUser?.cart) {
      setUpdatedCart(authUser.cart.map(item => ({ ...item })));
    }
  }, [authUser]);

  const cartItems = updatedCart.length > 0 ? updatedCart : authUser?.cart || [];


  const handleQuantityChange = (productId, newQuantity) => {
  
    if (newQuantity < 1) return;
    
    setUpdatedCart((prevCart) => {
      return prevCart.map((item) => 
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

 
  const incrementQuantity = (productId) => {
    setUpdatedCart((prevCart) => {
      return prevCart.map((item) => 
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const decrementQuantity = (productId) => {
    setUpdatedCart((prevCart) => {
      return prevCart.map((item) => 
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };


  const handleRemoveItem = (productId) => {
    setUpdatedCart((prevCart) => prevCart.filter(item => item.productId !== productId));
    toast.success('Item removed from cart');
  };


  const handleUpdateCart = async () => {
    try {
      setUpdatingCart(true);
      const updates = updatedCart.map(({ productId, name, price, quantity }) => ({
        productId,
        name,
        price,
        quantity
      }));

      const res = await axiosInstance.post("/cart/add", { updates });

      if (res.data.success) {
        toast.success('Cart updated successfully!');
      
        await checkAuth();
      } else {
        toast.error('Failed to update the cart.');
      }
    } catch (err) {
      console.error('Error updating cart', err);
      toast.error('Error updating cart.');
    } finally {
      setUpdatingCart(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="text-cyan-400 w-8 h-8" />
          <h1 className="text-3xl font-bold text-cyan-400">My Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <p className="text-xl text-gray-400 mb-4">Your cart is empty</p>
            <Link 
              to="/products" 
              className="inline-block bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
              {/* Cart header */}
              <div className="grid grid-cols-12 gap-2 bg-gray-700 p-4 text-sm font-medium text-gray-300">
                <div className="col-span-6 md:col-span-7">Product</div>
                <div className="col-span-3 md:col-span-3 text-center">Quantity</div>
                <div className="col-span-2 md:col-span-1 text-right">Price</div>
                <div className="col-span-1 md:col-span-1 text-right"></div>
              </div>

              {/* Cart items */}
              <div className="divide-y divide-gray-700">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-12 gap-2 p-4 items-center"
                  >
                    <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                      {/* Replace with actual image logic if available */}
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700 flex items-center justify-center rounded text-sm text-gray-400 flex-shrink-0">
                        IMG
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-sm md:text-base truncate">{item.name}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">
                          Unit: Tk {item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 md:col-span-3 flex items-center justify-center">
                      <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                        <button
                          onClick={() => decrementQuantity(item.productId)}
                          className="px-2 py-1 hover:bg-gray-600 text-gray-300"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleQuantityChange(item.productId, val);
                          }}
                          className="w-10 bg-gray-700 text-white text-center border-0 focus:ring-0 p-0"
                        />
                        <button
                          onClick={() => incrementQuantity(item.productId)}
                          className="px-2 py-1 hover:bg-gray-600 text-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 text-right text-sm md:text-base font-medium">
                      Tk {(item.price * item.quantity).toLocaleString()}
                    </div>

                    <div className="col-span-1 md:col-span-1 text-right">
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart summary */}
            <div className="bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Subtotal:</span>
                <span className="font-medium">Tk {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Shipping:</span>
                <span className="font-medium">Tk 0</span>
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl text-cyan-400 font-bold">
                    Tk {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
              <button
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
                onClick={handleUpdateCart}
                disabled={updatingCart}
              >
                {updatingCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Updating...
                  </span>
                ) : (
                  'Update Cart'
                )}
              </button>
              
              <button
                className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition-colors"
                onClick={() => toast.success('Checkout functionality coming soon!')}
                disabled={updatingCart}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;