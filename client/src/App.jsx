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

        </Routes>
      <Toaster position="top-right"/>
    </div>
  )
}

export default App
