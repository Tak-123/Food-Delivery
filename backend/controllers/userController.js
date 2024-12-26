//sign up and user logic
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//create login user function
const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        //if u do not find the email which is already registered
        if( !user ){
            return res.json({success:false,message:"User does not exist"})
        }
        //if we get user the we have to match users password with stored password in the database
        const isMatch = await bcrypt.compare(password,user.password);
        //if it doesnt match
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        //if password matches generate a token
        const token = createToken(user._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//create a token ,, id will be self generated in mongodb
const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//create register user function
const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }

        //validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }
        //if password is greater than 8 digit
        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }
        //encrypt password is done using bcrypt package
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);
        //create new user
        const newUser = new userModel({
             name:name,
             email:email,
             password:hashedPassword
        })
        
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {loginUser,registerUser}