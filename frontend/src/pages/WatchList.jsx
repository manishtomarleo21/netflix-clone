import React, { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const WatchlistPage = () => {
	const [watchlist, setWatchlist] = useState([]);
	const { setContentType } = useContentStore();

	// Fetch Watchlist
	const fetchWatchlist = async () => {
		try {
			const res = await axios.get("http://localhost:3000/api/watchlist/list", {
				withCredentials: true, // ✅ Ensures cookies (JWT) are sent
				headers: {
					"Content-Type": "application/json",
				},
			});
			setWatchlist(res.data.content);
		} catch (error) {
			console.error("Error fetching watchlist:", error.response?.data || error.message);
			toast.error("Failed to load watchlist");
		}
	};

	// Remove from Watchlist
	const handleRemove = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/api/watchlist/remove/${id}`, {
				withCredentials: true, // ✅ Ensures cookies (JWT) are sent
				headers: {
					"Content-Type": "application/json",
				},
			});
			setWatchlist((prev) => prev.filter((item) => item.id !== id));
			toast.success("Removed from watchlist");
		} catch (error) {
			toast.error("Failed to remove item");
		}
	};

	// Load watchlist on mount
	useEffect(() => {
		fetchWatchlist();
	}, []);

	return (
		<div className="bg-black min-h-screen text-white">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

				{watchlist.length === 0 ? (
					<p className="text-gray-400 text-center">Your watchlist is empty.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{watchlist.map((item) => (
							<div key={item.id} className="bg-gray-800 p-4 rounded relative">
								<Link
									to={`/watch/${item.id}`}
									onClick={() => setContentType(item.type)}
								>
									<img
										src={ORIGINAL_IMG_BASE_URL + item.image}
										alt={item.title}
										className="w-full h-auto rounded"
									/>
									<h2 className="mt-2 text-xl font-bold">{item.title}</h2>
								</Link>
								<button
									className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full"
									onClick={() => handleRemove(item.id)}
								>
									<Trash2 className="text-white size-5" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default WatchlistPage;