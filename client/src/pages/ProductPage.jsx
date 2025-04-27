
// import { useState, useEffect } from 'react'
// import { axiosInstance } from '../libs/axios'
// import { useAuthStore } from '../stores/authStore'
// import toast from 'react-hot-toast'
// import { Loader2, X, Heart, ShoppingCart, Info } from 'lucide-react'
// import FilterBar from '../components/FilterBar'

// const ProductPage = () => {
//   const { authUser } = useAuthStore()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [selectedCategory, setSelectedCategory] = useState()
//   const [activeFilters, setActiveFilters] = useState({})
//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     totalProducts: 0
//   })

//   // Debouncing search term
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchProducts()
//       console.log(activeFilters)
//     }, 500)

//     return () => clearTimeout(delayDebounce)
//   }, [searchTerm, pagination.page, selectedCategory, activeFilters])

//   const fetchProducts = async () => {
//     try {
//       setLoading(true)
      
//       // Create a clean query params object
//       const queryParams = {
//         search: searchTerm,
//         page: pagination.page,
//         limit: 8,
//         category: selectedCategory
//       }
      
//       // handle price filters separately
//       if (activeFilters.priceMin) queryParams.priceMin = activeFilters.priceMin
//       if (activeFilters.priceMax) queryParams.priceMax = activeFilters.priceMax
      
//       // handle array filters properly
//       Object.entries(activeFilters).forEach(([key, value]) => {
//         // skip price filters as we already handled them
//         if (key !== 'priceMin' && key !== 'priceMax' && Array.isArray(value)) {
//           queryParams[key] = value
//         }
//       })

//       const { data } = await axiosInstance.get('/product/search', {
//         params: queryParams,
//         // ensure arrays are properly serialized
//         paramsSerializer: params => {
//           const query = new URLSearchParams()
//           for (const key in params) {
//             const value = params[key]
//             if (Array.isArray(value)) {
//               value.forEach(v => query.append(key, v))
//             } else if (value !== undefined && value !== '') {
//               query.append(key, value)
//             }
//           }
//           return query.toString()
//         }
//       })

//       setProducts(data.products || [])
//       setPagination({
//         page: data.page || 1,
//         totalPages: data.totalPages || 1,
//         totalProducts: data.totalProducts || 0
//       })
//     } catch (error) {
//       console.error('Failed to fetch products:', error)
//       toast.error(error.response?.data?.message || 'Failed to fetch products')
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // will handle in future 
//   const handleAddToCart = (productId) => {
//     if(authUser?.role === 'admin') return
//     toast.success('Added to cart')
//   }

//   const handleAddToWishlist = (productId) => {
//     if(authUser?.role === 'admin') return   
//     toast.success('Added to wishlist')
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">

//      <div className="flex gap-8">
//         {/* Add FilterBar */} 
      
//         <FilterBar
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//           activeFilters={activeFilters}
//           setActiveFilters={setActiveFilters}
//         />
//         <div className="flex-1">
//           {/* Search Bar */}
//           <div className="max-w-3xl mx-auto mb-8">
//             <input
//               type="text"
//               placeholder="Search tech products..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value)
//                 setPagination(prev => ({ ...prev, page: 1 }))
//               }}
//               className="w-full px-6 py-3 bg-gray-800 text-gray-100 rounded-lg 
//                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                 placeholder-gray-400"
//             />
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex justify-center mt-12">
//               <Loader2 className="animate-spin text-blue-500 h-12 w-12" />
//             </div>
//           )}

//           {/* Products grid */}
//           {!loading && (
//             <>
//               {products.length === 0 ? (
//                 <div className="text-center mt-12 text-gray-400">
//                   No products found. Try another search term.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {products.map(product => (
//                     <div key={product._id} className="bg-gray-800 rounded-xl p-4 shadow-lg">
//                       {/* Product Image */}
//                       <div className="aspect-square mb-4 overflow-hidden rounded-lg">
//                         <img
//                           src={product.img || 'https://www.shutterstock.com/image-vector/computer-hardware-isometric-vector-illustration-600w-1482953249.jpg'}
//                           alt={product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       {/* Product Details */}
//                       <div className="space-y-2">
//                         <h3 className="text-gray-100 font-medium truncate">{product.name}</h3>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-400">Warranty: {product.warranty || 'N/A'}</span>
//                           <span className="text-blue-400 text-lg font-semibold">
//                             Tk {(product.price || 0).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Action buttons */}
//                       <div className="mt-4 flex gap-2">
//                         <button
//                           onClick={() => setSelectedProduct(product)}
//                           className="flex-1 flex items-center justify-center gap-1 
//                             bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 rounded-lg"
//                         >
//                           <Info size={16} /> Details
//                         </button>

//                         {authUser?.role !== 'admin' && (
//                           <button
//                           onClick={() => handleAddToWishlist(product._id)}
//                           className="p-2 
//                             bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg"
//                         >
//                           <Heart size={20} />
//                         </button>
//                         )}

//                         {authUser?.role !== 'admin' && (
//                         <button
//                         onClick={() => handleAddToCart(product._id)}
//                         className="p-2 
//                           bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
//                       >
//                         <ShoppingCart size={20} />
//                       </button>
//                         )}


//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Pagination*/}
//               {pagination.totalPages > 1 && (
//                 <div className="mt-8 flex justify-center gap-2">
//                   {Array.from({ length: pagination.totalPages }, (_, i) => (
//                     <button
//                       key={i + 1}
//                       onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
//                       className={`px-3 py-1 rounded-md ${
//                         pagination.page === i + 1 
//                           ? 'bg-blue-600 text-white' 
//                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {/* Product details Modal */}
//           {selectedProduct && (
//             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//               <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
//                 <button
//                   onClick={() => setSelectedProduct(null)}
//                   className="absolute top-4 right-4 text-gray-400 hover:text-white"
//                 >
//                   <X size={24} />
//                 </button>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
//                     <img
//                       src={selectedProduct.img || 'https://www.shutterstock.com/image-vector/computer-hardware-isometric-vector-illustration-600w-1482953249.jpg'}
//                       alt={selectedProduct.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <h2 className="text-2xl font-bold text-gray-100">
//                       {selectedProduct.name}
//                     </h2>
//                     <p className="text-gray-300">{selectedProduct.description || 'No description available'}</p>
                    
//                     <div className="space-y-2">
//                       <h3 className="text-lg font-medium text-gray-100">Specifications</h3>
//                       <dl className="grid grid-cols-2 gap-2 text-sm text-gray-400">
//                         {selectedProduct.specification && Object.entries(selectedProduct.specification).map(([key, value]) => (
//                           <div key={key} className="flex justify-between border-b border-gray-700 py-1">
//                             <dt className="capitalize">{key}:</dt>
//                             <dd className="text-gray-300">{ value === 'true' || value === 'false' ? ( value === 'true' ? "YES" : "NO") : value} </dd>
//                           </div>
//                         ))}
//                       </dl>
//                     </div>

//                     <div className="text-2xl font-bold text-blue-400">
//                       Tk {selectedProduct.price?.toLocaleString() || 'Price unavailable'}
//                     </div>
                    
//                     {/* Action Buttons in Modal */}
//                     <div className="flex gap-3 mt-4">
//                       <button
//                         onClick={() => handleAddToWishlist(selectedProduct._id)}
//                         disabled={authUser?.role === 'admin'}
//                         className="flex-1 flex items-center justify-center gap-2 
//                           bg-gray-700 hover:bg-gray-600 text-red-400 py-2 rounded-lg
//                           disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <Heart size={20} /> Wishlist
//                       </button>
                      
//                       <button
//                         onClick={() => handleAddToCart(selectedProduct._id)}
//                         disabled={authUser?.role === 'admin'}
//                         className="flex-1 flex items-center justify-center gap-2 
//                           bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
//                           disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <ShoppingCart size={20} /> Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductPage 

import { useState, useEffect } from 'react'
import { axiosInstance } from '../libs/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { Loader2, X, Heart, ShoppingCart, Info, Star } from 'lucide-react'
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

  const [reviews, setReviews] = useState([]) // Store reviews for selected product
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' }) // New review state
  const [reviewLoading, setReviewLoading] = useState(false) // Loading state for reviews

  // Debouncing search term
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts()
      console.log(activeFilters)
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, pagination.page, selectedCategory, activeFilters])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const queryParams = {
        search: searchTerm,
        page: pagination.page,
        limit: 8,
        category: selectedCategory
      }
      

      
      if (activeFilters.priceMin) queryParams.priceMin = activeFilters.priceMin
      if (activeFilters.priceMax) queryParams.priceMax = activeFilters.priceMax
      
      
      Object.entries(activeFilters).forEach(([key, value]) => {
        

        if (key !== 'priceMin' && key !== 'priceMax' && Array.isArray(value)) {
          queryParams[key] = value
        }
      })

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
      })

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

  const handleAddToWishlist = async (productId) => {
   
  
    try {
      const res = await axiosInstance.post(`/wishlist/add/${productId}`);
      toast.success(res.data.msg || 'Added to wishlist');
    } catch (error) {
      console.error('Add to Wishlist Error:', error);
      toast.error(error.response?.data?.msg || 'Something went wrong while adding to wishlist!');
    }

  }
  

  const handleAddReview = async (productId) => {
    if (authUser?.role === 'admin') return

    setReviewLoading(true)
    try {
      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
      }
      const { data } = await axiosInstance.post(`/product/reviews/${productId}`, reviewData)
      toast.success('Review added successfully')
      setReviews(prev => [...prev, data.review])
      setNewReview({ rating: 0, comment: '' }) // Clear review form
    } catch (error) {
      toast.error('Failed to add review')
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
        <div className="flex-1">
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


          {/* loadin stat*/}

          {loading && (
            <div className="flex justify-center mt-12">
              <Loader2 className="animate-spin text-blue-500 h-12 w-12" />
            </div>
          )}

          {/* prod grid */}

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
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                        <img
                          src={product.img || 'https://www.shutterstock.com/image-vector/computer-hardware-isometric-vector-illustration-600w-1482953249.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-gray-100 font-medium truncate">{product.name}</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Warranty: {product.warranty || 'N/A'}</span>
                          <span className="text-blue-400 text-lg font-semibold">
                            Tk {(product.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            fetchReviews(product._id)
                          }}
                          className="flex-1 flex items-center justify-center gap-1 
                            bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-2 rounded-lg"
                        >
                          <Info size={16} /> Details
                        </button>

                        {authUser?.role !== 'admin' && (
                          <button
                            onClick={() => handleAddToWishlist(product._id)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg"
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


          {/* product details Modal */}

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
                    <h2 className="text-2xl font-bold text-gray-100">{selectedProduct.name}</h2>
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

                    {/* Reviews Section */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-100">Reviews</h3>
                      <div className="mt-2 space-y-4">
                        {reviews.length === 0 ? (
                          <div className="text-gray-400">No reviews yet. Be the first to add one!</div>
                        ) : (
                          reviews.map((review, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Star size={16} className="text-yellow-400" />
                                <span className="font-semibold text-gray-100">{review.rating} / 5</span>
                              </div>
                              <p className="text-gray-300 mt-2">{review.comment}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Review Form */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-300">Add a Review</h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                            className="bg-gray-700 text-gray-100 p-2 rounded-lg"
                          >
                            <option value="0">Rate this product</option>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Your review"
                            className="w-full p-2 bg-gray-700 text-gray-100 rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => handleAddReview(selectedProduct._id)}
                          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                          disabled={reviewLoading || newReview.rating === 0 || newReview.comment === ''}
                        >
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
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


