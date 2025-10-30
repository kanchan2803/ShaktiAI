import jwt from 'jsonwebtoken'

export const ensureAuthenticated = (req,res,next)=>{
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(401)
                    .json({message:"Unauthorised, JWT token required"});
    }

    const token = auth.split(' ')[1];

    if(!token){
        return res.status(401)
                    .json({message:"Unauthorised, Token not find in header"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({message: "Unauthorised , JWT token is invalid or expired"});
    }
}