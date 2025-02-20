import { create } from "zustand";
import axios from 'axios';

const useWatchlistStore = create((set) => ({
    watchlist: [],
    
    fetchWatchlist: async () => {
        try {
            const res = await axios.get("/api/watchlist");
            set({ watchlist: res.data });
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    },

    addToWatchlist: async (movieId) => {
        try {
            await axios.post("/api/watchlist/add", { movieId });
            set((state) => ({ watchlist: [...state.watchlist, movieId] }));
        } catch (error) {
            console.error("Error adding to watchlist:", error);
        }
    },

    removeFromWatchlist: async (movieId) => {
        try {
            await axios.post("/api/watchlist/remove", { movieId });
            set((state) => ({
                watchlist: state.watchlist.filter((id) => id !== movieId)
            }));
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    }
}));

export default useWatchlistStore;