import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';


const CheckoutPage = async () => {
    //collect frm cust
    const [ cart, setCart ] = useState([]);  // cart contains an array of objs(product, name, price, quantity)
    const {authUser} = useAuthStore();
    const disMap = { "Bronze" : 0, "Silver" : 5, "Gold" : 10 };
    const loyaltyLevel = authUser.loyaltyLevel;

    // callting the cart api to return data 
    useEffect(()=>{
        const fetchCart = async () => {
            try {
                const res= await axiosInstance.get('/cart');
                setCart(res.data.items);
            } catch (error) {
                toad.error('Error fetching cart data');
            }
            };
            fetchCart();
    }, []);

    // discount related calcs
    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const discount = (subtotal * disMap[loyaltyLevel]) / 100
        const shipping = loyaltyLevel === 'Gold' ? 0 : 150 // Example shipping cost
        const total = subtotal - discount + shipping
        
        return { subtotal, discount, shipping, total }
        }
    
    const { subtotal, discount, shipping, total } = calculateTotals()
    

    const [customerInfo, setCustomerInfo ]= useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        postcode: '',
    });

    const [ shippingInfo, setShippingInfo  ] = useState({
        name: '',
        address: '',
        city: '',
        district: '',
        postcode: '',
    });

    const [ sameAsCust, setSameAsCust] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // handles user inputs
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
        if (sameAsCust) {
          setShippingInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    // handles shippinf info
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    };

    // handling same as cust function.
    const handleSameAsCust = (e)=>{
        const checked = e.target.checked;
        setSameAsCust(checked);

        if(checked){
            setShippingInfo(customerInfo);
        }else {
            setShippingInfo({
              name: '',
              address: '',
              city: '',
              district: '',
              postcode: '',
            });
        };
    };

    // handles checkout
    const handleProceedToPay = async () =>{
        e.preventDefault();
        setIsLoading(true);

        try {
            // for ssl commerz
            const items = cart.map(item => ({
                productId: item._id,
                name: item.name,   
                quantity: item.quantity,
              }));
            // obj to send to the order api
            const orderInfo = {
                user : authUser._id,
                items,
                shippingInfo
            };
            
            const orderResponse = await axiosInstance.post("/order", orderInfo);
            toast.success(orderResponse.msg); //send success or failure msgs
            const sslResponse = await axiosInstance.post("/payment/init",{
                items,
                customerInfo,
                shippingInfo: sameAsCust ? customerInfo : shippingInfo
            });

            if (sslResponse.data.success) {
                window.location.href = response.data.url;
              } else {
                toast.error('Failed to initiate payment. Try again.');
            };
        } catch (error) {
            toast.error(error.response.data.msg);
        }finally{
            setIsLoading(false);
        }

    }
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="lg:w-2/3 space-y-8">
          {/* Customer Information Form */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">District</label>
                <input
                  type="text"
                  name="dist"
                  value={customerInfo.district}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Postcode</label>
                <input
                  type="number"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Information Form */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Shipping Address</h2>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={sameAsCust}
                  onChange={handleSameAsCust}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                Same as customer information
              </label>
            </div>
            <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">District</label>
                <input
                  type="text"
                  name="dist"
                  value={customerInfo.district}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Postcode</label>
                <input
                  type="number"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerChange}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md"
                  required
                />
              </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Order Summary</h2>
            
            {/* Products List */}
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-100">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-100">Tk {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-gray-100">Tk {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Discount: ({disMap[loyaltyLevel]}%):</span>
                <span className="text-green-400">- Tk {discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Shipping:</span>
                <span className={`${shipping === 0 ? 'text-green-400' : 'text-gray-100'}`}>
                  {shipping === 0 ? 'FREE' : `Tk ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-100">Total:</span>
                <span className="text-blue-400">Tk {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={handleProceedToPay}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
              
              <Link
                to="/cart"
                className="block w-full py-3 text-center bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-md"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
)};

export default CheckoutPage;