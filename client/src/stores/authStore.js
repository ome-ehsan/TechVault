import {create} from 'zustand'
import { axiosInstance } from "../libs/axios"


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
    







}));