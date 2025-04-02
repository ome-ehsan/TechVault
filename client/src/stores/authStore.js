import {create} from 'zustand'
import { axiosInstance } from "../libs/axios"
import toast from 'react-hot-toast';


export const useAuthStore = create( (set,get)=> ({
    authUser : false,
    isCheckingAuth : true,
    isLogging : false,
    isRegistering : false,
    checkAuth : async ()=> {
        try {
            const res = axiosInstance.get("/auth/check");
            set( { authUser : res.data});
        } catch (error) {
            console.log( "Error in authentication", error);
            set( { authUser : null});
        }finally{
            set( {isCheckingAuth: false});
        }
    },
    logout : async ()=> {
        try {
            const res = axiosInstance.get("/auth/logout");
            set({ authUser : null});
            toast.success(res.data.msg);
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    },
    
    

}));