import { useState, useEffect } from 'react'
import { axiosInstance } from '../libs/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { Loader2, X, ShoppingCart } from 'lucide-react'

const WishlistPage = () => {
  const { authUser } = useAuthStore()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get('/wishlist/get', {
        withCredentials: true,
      })
      setWishlist(data.wishlist || [])
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      toast.error(error.response?.data?.msg || 'Failed to fetch wishlist')
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const { data } = await axiosInstance.delete(`/wishlist/remove/${productId}`, {
        withCredentials: true,
      })
      toast.success(data.msg)
      setWishlist((prev) => prev.filter((item) => item._id !== productId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      toast.error(error.response?.data?.msg || 'Failed to remove from wishlist')
    }
  }

  const handleAddToCart = async (productId, price) => {
    try {
      const res = await axiosInstance.post('/payment/cart/add', { productId, quantity: 1, price })
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error(error.response?.data?.msg || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">My Wishlist</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mt-12">
            <Loader2 className="animate-spin text-blue-500 h-12 w-12" />
          </div>
        )}

        {/* Wishlist grid */}
        {!loading && (
          <>
            {wishlist.length === 0 ? (
              <div className="text-center mt-12 text-gray-400">
                Your wishlist is empty.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map(product => (
                  <div key={product._id} className="bg-gray-800 rounded-xl p-4 shadow-lg">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.img || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-gray-100 font-medium truncate">{product.name}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{product.category}</span>
                        <span className="text-blue-400 text-lg font-semibold">
                          Tk {(product.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1 
                          bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 rounded-lg"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product._id, product.price)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.img || 'https://via.placeholder.com/300'}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-100">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-gray-400 capitalize">{selectedProduct.category}</div>

                  <div className="text-2xl font-bold text-blue-400">
                    Tk {selectedProduct.price?.toLocaleString() || 'Unavailable'}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleRemoveFromWishlist(selectedProduct._id)}
                      className="flex-1 flex items-center justify-center gap-2 
                        bg-gray-700 hover:bg-gray-600 text-red-400 py-2 rounded-lg"
                    >
                      <X size={20} /> Remove
                    </button>
                    <button
                      onClick={() => handleAddToCart(selectedProduct._id, selectedProduct.price)}
                      className="flex-1 flex items-center justify-center gap-2 
                        bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                      <ShoppingCart size={20} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
