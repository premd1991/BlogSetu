import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function handleCreateNewUser (req, res){
   try {
    const {fullName, email, password, gender} = req.body

    if (!fullName || !email || !password || !gender){
        return res.status(400).json({message: "Some data is missing"})
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({message: "User already exists with this email"})
    }

    let newUser = await User.create({
        fullName,
        email,
        password,
        gender
    });

    // Remove password from output for security
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return res.status(201).json({message: "User created successfully!", user: userWithoutPassword})
   }
   catch(err){
        return res.status(500).json({error: `${err}`})
   }
};

export async function handleLoginUser (req, res){
    try {
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json({message: "Some Data is Missing"})
        }

        // Find user by email
        let dbUser = await User.findOne({ email })

        if (!dbUser){
            return res.status(401).json({message: "Invalid email or password"})
        }

        // Verify password
        const isMatch = await dbUser.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        let token = jwt.sign({
            _id: dbUser._id,
            email: dbUser.email,
            role: dbUser.role
        }, process.env.JWT_PRIVATE_KEY)

        // Set secure, httpOnly cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Send user info alongside token (excluding password)
        const userWithoutPassword = dbUser.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            message: "User Login Success!", 
            accessToken: token, 
            user: userWithoutPassword
        })
    }
    catch(err){
        return res.status(500).json({ error: `${err}`})
    }
};

export async function handleLogoutUser (req, res){
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(200).json({message: "User Logout!"})
    }
    catch(err){
        return res.status(500).json({error: `${err}`})
    }
};

export async function handleUpdateUser (req, res){
    try {
        const { fullName, gender } = req.body;
        const userId = req.user._id;

        if (!fullName && !gender) {
            return res.status(400).json({message: "No fields to update provided"});
        }

        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (gender) updateFields.gender = gender;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ error: `${err}` });
    }
};

export async function handleDeleteUser (req, res){
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.clearCookie("accessToken");
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: `${err}` });
    }
};

export async function handleGetCurrentUser (req, res){
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ error: `${err}` });
    }
};