import {create} from 'zustand'
import { axiosInstance } from "../libs/axios"
import toast from 'react-hot-toast';


export const useAuthStore = create( (set,get)=> ({
    authUser : false,
    isCheckingAuth : true,
    isLogging : false,
    isSigning : false,
    checkAuth : async ()=> {
        try {
            const res = await axiosInstance.get("/auth/check");
            set( { authUser : res.data});
        } catch (error) {
            console.log( "Error in authentication", error);
            set( { authUser : null});
        }finally{
            set( {isCheckingAuth: false});
        }
    },

    login : async (formData)=> {
        set( {isLogging : true});
        try {
            const res = await axiosInstance.post("/auth/login",formData);
            set({authUser: res.data});
            toast.success(res.data.msg || "Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.msg)
        }finally{
            set({ isLogging : false});
        }
    },
    signUp : async (formData)=> {
        set( {isSigning : true});
        try {
            const res = await axiosInstance.post("/auth/register",formData);
            set({authUser: res.data});
            toast.success(res.data.msg || "Signed up successfully");
        } catch (error) {
            toast.error(error.response.data.msg)
        }finally{
            set({ isSigning : false});
        }
    },
    logout : async ()=> {
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({ authUser : null});
            toast.success(res.data.msg);
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    },
    
    

}));