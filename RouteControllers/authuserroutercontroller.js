const bcrypt = require ("bcryptjs");
const User = require ("../Models/authuser.model");
const jwtToken = require ('../Utils/jwtwebToken');


// For Register

const userRegister = async(req,res)=>{
    try {
        const {fullname,username,email,password,profilepic,gender} = req.body;
        const existingUser = await User.findOne({$or: [{username},{email}],});
        if (existingUser) {
            return res.status(400).json({success:false , message: "Username or Email already exist"})};

        const hashedPassword = await bcrypt.hash(password,10);
        const defaultProfilePic =
        gender === "male" ? `https://avatar.iran.liara.run/public/boy?username=${username}`: `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password : hashedPassword,
            gender,
            profilepic: profilepic || defaultProfilePic
        })

        await newUser.save()

        jwtToken(newUser._id,res)


       return res.status(201).json({
            success: true,
            _id : newUser._id,
            fullname : newUser.fullname,
            username : newUser.username,
            profilepic : newUser.profilepic,
            email : newUser.email,
            message: "Account Created Successfully"
        })

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

// For Login

const userLogin = async(req,res)=>{
    try {
       const {email,password} = req.body;
       const user = await User.findOne ({email})
       if (!user) return res.status(400).json({success: false, message: "Email Doesn't Exist"})
        const comparePassword = await bcrypt.compare(password,user.password);
       if (!comparePassword) return res.status(401).json({success: false, message: "Invalid Email or Password"}) 
    
       jwtToken(user._id,res)


        res.status(200).json({
            success: true,
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            profilepic : user.profilepic,
            email : user.email,
            message : "Successfully Login"
        })        
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
 
    }
}

// For Logout

const userLogout = async(req,res)=>{
    try {
        res.cookie("jwt", '' , {
            maxAge : 0
        })
        res.status(200).json({ success: true, message : "User LogOut Successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})        
    }
}

module.exports = { userRegister, userLogin, userLogout };