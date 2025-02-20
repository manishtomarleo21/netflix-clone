import axios from 'axios'
import toast from 'react-hot-toast';
import { create } from 'zustand'

export const useAuthStore = create((set)=>({
    user:null,
    isSigningUp:false,
    isCheckingAuth:true,
    isLoggingOut:false,
    isLoggineIn:false,
    signup: async(credentials)=>{
        set({isSigningUp:true})
        try {
            const response = await axios.post('/api/auth/signup', credentials);
            set({user:response.data.user, isSigningUp:false}) 
            toast.success("Account Created Successfully")
        } catch (error) {
            toast.error(error.response.data.message || "An error occured");
            set({isSigningUp:false, user:null})
        }
    },
    login: async(credentials)=>{
        set({isLoggineIn:true});
        try {
            const response = await axios.post('/api/auth/login', credentials);
            set({user:response.data.user, isLoggineIn:false}) 
        } catch (error) {
            set({isLoggineIn:false, user:null})
            toast.error(error.response.data.message || "Login Failed");
        }
    },
    logout: async()=>{
        set({isLoggingOut:true}); 
        try {
            await axios.post('/api/auth/logout');
            set({user:null, isLoggingOut:false});
            toast.success("Logged out Successfully")

        } catch (error) {
            set({isLoggingOut:false});
            toast.error(error.response.data.message || "Logout failed")
            
        }
    },
    authCheck: async()=>{
        set({isCheckingAuth:true});
        try {
            const response = await axios.get('/api/auth/authCheck'); 
            set({user:response.data.user, isCheckingAuth:false});
        } catch (error) {
            set({user:null, isCheckingAuth:false});
            // toast.error(error.response.data.message || "An error occured");
            
        }
    },
}))