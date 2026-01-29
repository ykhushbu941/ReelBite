const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    
    const { fullName, email, password } = req.body;

    const isUserAlreadyExits = await userModel.findOne({
        email
    })

    if (isUserAlreadyExits) {
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName, 
        email, 
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, "fafcecb84f5a809bf1d4df62cae548e181ebbfc5")

    res.cookie("token", token)
    
    res.status(201).json({
        message: "User registered successfully",
        user:{
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, "17ebd082ea4d3add411fd9fb8a185b147dd131d9")

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            _id: user.id,
            email: user.email,
            fullName: user.fullName
        }
    })

    
 }

module.exports = {
    registerUser,
    loginUser
}