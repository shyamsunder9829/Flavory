const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// cookie options - use none+secure in production (for cross-site cookies over HTTPS)
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd
};

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Basic email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const isUserAlreadyExists = await userModel.findOne({ email })

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, JWT_SECRET)

        // set cookie (httpOnly) and expose token in response for Authorization header fallback
        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("registerUser error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
} 

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET)

        // set cookie (httpOnly) and expose token in response for Authorization header fallback
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (err) {
        console.error("loginUser error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
} 

function logoutUser(req, res) {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "User logged out successfully"
    });
}


async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({ email })

        if (isAccountAlreadyExists) {
            return res.status(400).json({ message: "Food partner account already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        })

        const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET)

        // set cookie (httpOnly) and expose token in response for Authorization header fallback
        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "Food partner registered successfully",
            token,
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone
            }
        })
    } catch (err) {
        console.error("registerFoodPartner error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
} 

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

        const foodPartner = await foodPartnerModel.findOne({ email })

        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET)

        // set cookie (httpOnly) and expose token in response for Authorization header fallback
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Food partner logged in successfully",
            token,
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        })
    } catch (err) {
        console.error("loginFoodPartner error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}