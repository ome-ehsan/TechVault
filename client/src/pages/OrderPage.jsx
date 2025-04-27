import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../libs/axios';
import toast from 'react-hot-toast';
import { ShoppingBag, CreditCard, Download, X, ChevronLeft, ChevronRight, Calendar, Package } from 'lucide-react';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/payment/order/get?page=${currentPage}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error in fetching orders:", error);
      toast.error(error?.response?.data?.msg || 'Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axiosInstance.delete(`/payment/order/cancel/${orderId}`);
      toast.success(res.data.msg);
      // refresh orders \ update UI
      fetchOrders();
    } catch (error) {
      toast.error(error.res?.data?.msg);
    }
  };

  const handlePayNow = async (order) => {
    try {
      const customerInfo = order.customerInfo;
      const shippingInfo = order.shippingInfo;
      const sslResponse = await axiosInstance.post("/payment/init",{
          customerInfo,
          shippingInfo,
          order
      });
      if (sslResponse.data.success) {
          window.location.href = sslResponse.data.url;
          //window.open(sslResponse.data.url, "_self");
        } else {
          toast.error(sslResponse.data.msg);
      };
    } catch (error) {
      toast.error('Payment initiation failed');
      console.error("Error initiating payment:", error);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const loadingToast = toast.loading('Generating invoice...');
      const response = await axiosInstance.get(`/payment/generate-inv/${orderId}`, {
        responseType: 'blob', // tells axios to handle response as binary data
      });
    
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = `TechVault-Invoice-${orderId}.pdf`;
 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded successfully');
      
    } catch (error) {
      toast.error('Failed to download invoice');
      console.error("Error downloading invoice:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
      >
        <ChevronLeft size={18} className="mr-1" />
        Prev
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-3 py-2 rounded ${currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
      >
        Next
        <ChevronRight size={18} className="ml-1" />
      </button>
    );

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 px-4 pb-10">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2" size={28} />
          My Orders
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <Package size={48} className="text-gray-400 mb-4" />
            <p className="text-2xl font-semibold text-white">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-all">
                {/* Order Header */}
                <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-white">ID: {order._id.substring(0, 8)}...</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                    order.paymentStatus === 'paid' ? 'bg-green-400 text-gray-900' :
                    order.paymentStatus === 'failed' ? 'bg-red-400 text-white' :
                    'bg-yellow-400 text-gray-900'
                  }`}>
                    {order.paymentStatus === 'paid' && <CreditCard size={14} className="mr-1" />}
                    {order.paymentStatus === 'failed' && <X size={14} className="mr-1" />}
                    {order.paymentStatus === 'pending' && <Clock size={14} className="mr-1" />}
                    {order.paymentStatus.toUpperCase()}
                  </div>
                </div>
                
                {/* Order Content */}
                <div className="p-4">
                  <div className="mb-3 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <p className="text-sm text-gray-300">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between border-b border-gray-600 pb-2">
                        <div>
                          <p className="font-medium text-white">{item.prodName}</p>
                          <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="flex justify-between items-center font-semibold text-white pt-2">
                    <span>Total Amount:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping Info */}
                  {order.shippingInfo && (
                    <div className="mt-3 text-sm text-gray-300">
                      <p className="font-medium text-white">Shipping Address:</p>
                      <p>{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                      <p>{order.shippingInfo.district}, {order.shippingInfo.postCode}</p>
                      <p>{order.shippingInfo.country}</p>
                    </div>
                  )}
                </div>
                
                {/* Order Actions */}
                <div className="bg-gray-800 px-4 py-3 flex justify-between">
                  <div className="flex space-x-2">
                  {order.paymentStatus === 'failed' && (
                      <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors flex items-center"
                    >
                      <X size={16} className="mr-1" />
                      Cancel Order
                    </button>
                    )}
                    {order.paymentStatus === 'failed' && (
                      <button 
                        onClick={() => handlePayNow(order)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <CreditCard size={16} className="mr-1" />
                        Pay Now
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDownloadInvoice(order._id)}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors flex items-center"
                    >
                      <Download size={16} className="mr-1" />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;