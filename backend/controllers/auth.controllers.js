import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res)=>{
    
    try {
        const { email, password, username } = req.body;

        if(!email || !password || !username){
            return res.status(400).json({success:false, message:"Please fill all the fields"})
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)) return res.status(400).json({success:false, message:"Invalid email"});

        if(password.length < 6) return res.status(400).json({success:false, message:"Password length must be 6 or more"});
        
        const existingUserbyEmail = await User.findOne({email:email})  
        if(existingUserbyEmail) return res.status(400).json({success:false, message:"Email Already Exists"});

        const existingUserbyUsername = await User.findOne({username:username})  
        if(existingUserbyUsername) return res.status(400).json({success:false, message:"Username Already Exists"});

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const PROFILE_PICS = ['/av1.png', '/av2.png', '/av3.png'];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email:email,
            password:hashPassword,
            username:username,
            image:image
        })

        
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        //Remove password from response
        res.status(201).json({success:true, user: {
            ...newUser._doc,
            password:""
            },
        });
       

    } catch (error) {
        console.log('Error in Signing Up', error.message);
        res.status(500).json({success:false, message:"Internal server error"});
        
    }
}

export const login = async (req, res)=>{
    
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message:"Please fill all fields"});
        }

        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if(!passwordCheck){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({success:true, user: {
            ...user._doc,
            password:""
            },
        });

    } catch (error) {
        console.log('Error in logging in', error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export const logout = async (req, res)=>{
    try {
        res.clearCookie('jwt-netflix');
        res.status(200).json({success:true, message:"Logged out successfully"});
    } catch (error) {
        console.log("Error while logging out", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
        
    }
}

export const authCheck = async (req, res)=>{

    try {
        res.status(200).json({success:true, user:req.user})
    } catch (error) {
        console.log("error in authCheck", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}