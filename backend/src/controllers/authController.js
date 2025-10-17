import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req,res) => {
    try {
        console.log("Signup request body:", req.body);
        //1.
        const {name,email,password} = req.body;

        //2.
        const user = await User.findOne({email});
        if(user){
            return res.status(409)
                    .json({message: "User Already exists",success: false});
        }

        //3.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //4
        const newUser  = await User.create({
            name,
            email,
            password: hashedPassword
        }); 
        await newUser.save();

        //5.
        console.log("Signup Succesful , User:",newUser);
        res.status(201)
            .json({
                message:"SignUp Succesful",
                success: true,
                user: newUser
            })


    } catch (error) {
       console.log("Signup failed, error", error);
        res.status(500)
            .json({
                message: "Internal Server Error in Signup Controller",
                success: false,
                error
            }) 
    }
}

export const login = async (req,res)=>{
    try {
        console.log("Login Request body:",req.body);

        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }

        //step 3: generate token
        const token = jwt.sign(
            { email: user.email, _id:user._id},
            process.env.JWT_SECRET, 
            { expiresIn: "1h"},
        )

        console.log("Login successful from controller");
        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                user,
                token
            })
    } catch (error) {
        console.log("Login error: ",error);
        res.status(500).json({ 
            message: "Server error in Login",
            error
        });
    }
}

