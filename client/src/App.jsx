import React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./stores/authStore"
import {Loader} from 'lucide-react'
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import { Routes,Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import AdminSignUpPage from "./pages/AdminSignUpPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import ProductPage from "./pages/ProductPage"
import CheckoutPage from "./pages/CheckoutPage"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentFailure from "./pages/PaymentFailure"
import OrderPage from "./pages/OrderPage"
import CustomerProfile from "./pages/CustomerProfile"
import CartPage from "./pages/CartPage"








const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(
    ()=>{
      checkAuth()
    }, [checkAuth]
  );
  // if user being verified show loadin
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  };

  return (
    <div>
      <Navbar/>
        {/* Routing */}
        <Routes>

            <Route path="/" element={
              authUser ? (
                authUser.role === 'admin' ? <AdminDashboardPage /> : <ProductPage />
              ) : (
                <Navigate to="/login" />
              )
            } />

            <Route path="/login" element ={ !authUser ? <LoginPage/> : <Navigate to="/" /> }/>
            <Route path="/signup" element ={ !authUser ? <SignUpPage/> : <Navigate to="/" /> }/>
            <Route path="/admin/signup" element = { !authUser ? <AdminSignUpPage/> : <Navigate to="/" /> }/>
            <Route path="/admin/products" element = { authUser ? <ProductPage/> : <Navigate to="/login" />} />
            <Route path="/products" element = { authUser ? <ProductPage/> : <Navigate to="/login" />} />
            <Route path="/checkout" element = { authUser ? <CheckoutPage/> : <Navigate to="/login" />} />
            <Route path="/success" element = { authUser? <PaymentSuccess/> : <Navigate to="/login"/>} />
            <Route path="/failure" element = { authUser? <PaymentFailure/> : <Navigate to="/login"/>} />
            <Route path="/orders" element = { authUser? <OrderPage/> : <Navigate to="/login"/>} />

            <Route path="/cart" element={ <CartPage /> } />


            <Route path="/profile" element = { authUser? <CustomerProfile/> : <Navigate to="/login"/>} />

            <Route path="/admin/dashboard" element = { authUser? <AdminDashboardPage/> : <Navigate to="/login"/>} />
        </Routes>
      <Toaster position="top-right"/>
    </div>
  )
}

export default App
