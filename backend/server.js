import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';

import authRoutes from './routes/auth.routes.js'
import movieRoutes from './routes/movie.routes.js'
import tvRoutes from './routes/tv.routes.js'
import searchRoutes from './routes/search.routes.js'
import watchlistRoutes from './routes/watchlist.routes.js'
import { ENV_VARIABLES } from './config/envVariables.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Allow frontend requests
    credentials: true, // Allow cookies and authentication headers
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    allowedHeaders: "Content-Type,Authorization" // Allow headers
}));

const PORT = ENV_VARIABLES.PORT;
const __dirname = path.resolve();

app.use(express.json()); //to use req.body
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/movie', protectRoute, movieRoutes);
app.use('/api/tv', protectRoute, tvRoutes);
app.use('/api/search', protectRoute, searchRoutes);
app.use('/api/watchlist', protectRoute, watchlistRoutes);

if(ENV_VARIABLES.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}


app.listen(PORT, ()=>{
    console.log("Server started port "+PORT);
    connectDB();  
})




