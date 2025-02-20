import jwt from 'jsonwebtoken'
import { ENV_VARIABLES } from '../config/envVariables.js'

export const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId}, ENV_VARIABLES.JWT_SECRET, {expiresIn:"10d"});

    res.cookie('jwt-netflix', token, {
        maxAge: 10*24*60*60*1000, //10 days in milliseconds;
        httpOnly:true, //prevent xss attack and not be accessible by javascript
        sameSite:"strict",
        secure: ENV_VARIABLES.NODE_ENV !== 'development'
    })

    return token;
}
