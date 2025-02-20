import express from 'express'
import { addToWatchList, getWatchList, removeFromWatchlist } from '../controllers/list.controller.js';

const router = express.Router();

router.post('/add', addToWatchList);
router.delete('/remove/:id', removeFromWatchlist);
router.get('/list', getWatchList);

export default router;

// import express from 'express';
// import { User } from "../models/user.model.js";

// const router = express.Router();

// router.post('/watchlist', async (req, res) => {
//     try {
//         const { contentId } = req.body;
//         const userId = req.user._id; // Extracted from JWT token

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         // Avoid duplicate entries
//         if (!user.watchlist.includes(contentId)) {
//             user.watchlist.push(contentId);
//             await user.save();
//         }

//         res.json({ message: "Added to watchlist", watchlist: user.watchlist });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// export default router;