import jwt from 'jsonwebtoken'

export const ensureAuthenticated = (req,res,next)=>{
    const auth = req.headers['Authorization'];
    if(!auth){
        return res.status(401)
                    .json({message:"Unauthorised, JWT token required"});
    }

    try {
        const decoded = jwt.verify(auth,process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({message: "Unauthorised , JWT token required or expired"});
    }
}