import jwt from "jsonwebtoken"
//create middleware
const authMiddleware = async(req,res,next)=>{
    const {token} = req.headers;//get token
    if (!token) {
        return res.json({success:false,message:"Not Authorized Login Again"})
    }
    try {
        //Decode the token if token is present
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}   

export default authMiddleware;