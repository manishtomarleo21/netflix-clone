import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";


export const addToWatchList = async (req, res) => {
    const { id, mediaType } = req.body;
    

    if (!id || !mediaType) {
        return res.status(400).json({ success: false, message: "Missing required fields: id or mediaType" });
    }

    if (!req.user || !req.user._id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`);

        if (!response) {
            return res.status(400).json({ success: false, message: "Item not found" });
        }

        //WARN duplicate
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //  Check if the item is already in the watchlist
        const alreadyExists = user.watchlist.some(item => item.id === id);
        if (alreadyExists) {
            return res.status(400).json({ success: false, message: "Item already in watchlist" });
        }
        

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            $push: {
                watchlist: {
                    id: response.id,
                    image: response.poster_path || response.profile_path,
                    title: response.title || response.name,
                    mediaType,
                    createdAt: new Date(),
                },
            },
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Added to watchlist", content: response });

    } catch (error) {
        console.error(" Error adding to watchlist:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



export const removeFromWatchlist = async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { watchlist: { id: id } },
        });

        res.status(200).json({ success: true, message: "Removed from watchlist" });
    } catch (error) {
        console.log("Error removing from watchlist", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getWatchList = async (req, res)=>{
    try {
        res.status(200).json({ success: true, content: req.user.watchlist });
    } catch (error) {
        console.log("Error fetching watchlist", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}