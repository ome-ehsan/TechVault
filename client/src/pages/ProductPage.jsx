import { useState, useEffect } from 'react'
import { axiosInstance } from '../libs/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { Loader2, X, Heart, ShoppingCart, Info } from 'lucide-react'
import FilterBar from '../components/FilterBar'

const ProductPage = () => {
  const { authUser } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState()
  const [activeFilters, setActiveFilters] = useState({})
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalProducts: 0
  })

  // Debouncing search term
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, pagination.page,selectedCategory,activeFilters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // const { data } = await axiosInstance.get('/product/search', {
      //   params: {
      //     search: searchTerm,
      //     page: pagination.page,
      //     limit: 8,
      //     category : selectedCategory,
      //     ...activeFilters
      //   }
      // })

/////EDITED///////////////
      const filterParams = {}
      Object.entries(activeFilters).forEach(([key, values]) => {
        values.forEach(value => {
          if (!filterParams[key]) filterParams[key] = []
          filterParams[key].push(value)
        })
      })

      const queryParams = {
        search: searchTerm,
        page: pagination.page,
        limit: 8,
        category: selectedCategory,
        ...filterParams
      }

      const { data } = await axiosInstance.get('/product/search', {
        params: queryParams,
        paramsSerializer: params => {
          const query = new URLSearchParams()
          for (const key in params) {
            const value = params[key]
            if (Array.isArray(value)) {
              value.forEach(v => query.append(key, v))
            } else if (value !== undefined && value !== '') {
              query.append(key, value)
            }
          }
          return query.toString()
        }
      });
////////////////////////////////


      setProducts(data.products || [])
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        totalProducts: data.totalProducts || 0
      })
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // will handle in future 
  const handleAddToCart = async (productId,price) => {
    try {
      const res = await axiosInstance.post("/payment/cart/add", {productId, quantity: 1, price});
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    }
  }

  const handleAddToWishlist = (productId) => {
    if(authUser?.role === 'admin') return   
    toast.success('Added to wishlist')
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">

     <div className="flex gap-8">
        {/* Add FilterBar */}
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
        <div className="flex-1">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search tech products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="w-full px-6 py-3 bg-gray-800 text-gray-100 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder-gray-400"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center mt-12">
              <Loader2 className="animate-spin text-blue-500 h-12 w-12" />
            </div>
          )}

          {/* Products grid */}
          {!loading && (
            <>
              {products.length === 0 ? (
                <div className="text-center mt-12 text-gray-400">
                  No products found. Try another search term.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product._id} className="bg-gray-800 rounded-xl p-4 shadow-lg">
                      {/* Product Image */}
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                        <img
                          src={product.img || 'https://www.shutterstock.com/image-vector/computer-hardware-isometric-vector-illustration-600w-1482953249.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        <h3 className="text-gray-100 font-medium truncate">{product.name}</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Warranty: {product.warranty || 'N/A'}</span>
                          <span className="text-blue-400 text-lg font-semibold">
                            Tk {(product.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 flex items-center justify-center gap-1 
                            bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 rounded-lg"
                        >
                          <Info size={16} /> Details
                        </button>

                        {authUser?.role !== 'admin' && (
                          <button
                          onClick={() => handleAddToWishlist(product._id)}
                          //disabled={authUser?.role !== 'admin'}
                          className="p-2 disabled:opacity-50 disabled:cursor-not-allowed
                            bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg"
                        >
                          <Heart size={20} />
                        </button>
                        )}

                        {authUser?.role !== 'admin' && (
                        <button
                        onClick={() => handleAddToCart(product._id,product.price)}
                        //disabled={authUser?.role !== 'admin'}
                        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed
                          bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                      >
                        <ShoppingCart size={20} />
                      </button>
                        )}


                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination*/}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      className={`px-3 py-1 rounded-md ${
                        pagination.page === i + 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Product details Modal */}
          { /* Modal to hand;e prod detals */}
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
                      src={selectedProduct.img || 'https://www.shutterstock.com/image-vector/computer-hardware-isometric-vector-illustration-600w-1482953249.jpg'}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-100">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-300">{selectedProduct.description || 'No description available'}</p>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-100">Specifications</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                        {selectedProduct.specification && Object.entries(selectedProduct.specification).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-gray-700 py-1">
                            <dt className="capitalize">{key}:</dt>
                            <dd className="text-gray-300">{ value === 'true' || value === 'false' ? ( value === 'true' ? "YES" : "NO") : value} </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="text-2xl font-bold text-blue-400">
                      Tk {selectedProduct.price?.toLocaleString() || 'Price unavailable'}
                    </div>
                    
                    {/* Action Buttons in Modal */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleAddToWishlist(selectedProduct._id)}
                        disabled={authUser?.role === 'admin'}
                        className="flex-1 flex items-center justify-center gap-2 
                          bg-gray-700 hover:bg-gray-600 text-red-400 py-2 rounded-lg
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Heart size={20} /> Wishlist
                      </button>
                      
                      <button
                        onClick={() => handleAddToCart(selectedProduct._id)}
                        disabled={authUser?.role === 'admin'}
                        className="flex-1 flex items-center justify-center gap-2 
                          bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
                          disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

export default ProductPage