import User from "../model/User";
import bcrypt from "bcryptjs";

export const getAllUser = async(request, response, next) => {
    let users;
    try {
        users =  await User.find();
    }   
    catch (err) {
        console.log(err)
    }

    if(!users) {
        return response.status(404).json({
            message: "No Users Found",
            success: false
        })
    }

    return  response.status(200).json({
        message: "Users Found",
        success: true,
        users
    })
}

export const signUp = async(request, response, next) => {
    const { name, email, password } = request.body;

    let existingUser;

    if(!name && !email && !password) {
        return response.status(400).json({message: "Enter User Credentials", success: false})
    }

    try {
        existingUser =  await User.findOne({email});
    }
    catch (err) {
        console.log(err);
        return response.status(400).json({message: err, success: false})
    }

    if(existingUser) {
        return response.status(400).json({message: "User Already Exists", success: false})
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({name, email, password: hashedPassword, blogs:[]});

    try {
        await user.save();
    }
    catch(err) {
        return response.status(400).json({message: err, success: false})
    }

    return response.status(201).json({
        message: "User Added Successfully",
    })
        
}

export const login = async(request, response, next) => {
    const {email, password} = request.body;

    let existingUser;

    if(!email || !password) {
        return response.status(400).json({message: "Invalid  Credentials", success: false})
    }

    try {
        existingUser =  await User.findOne({email});
    }
    catch (err) {
        return response.status(400).json({message: err, success: false})
    }

    if(!existingUser) {
        return response.status(400).json({message: "Couldnt find user", success: false})
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if(!isPasswordCorrect) {
        return response.status(400).json({message: "Invalid password", success: false})
    }

    return  response.status(200).json({message: "Successfully LoggedIn", success: true})
}