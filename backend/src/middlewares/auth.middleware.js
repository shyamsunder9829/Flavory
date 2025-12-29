const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function authFoodPartnerMiddleware(req, res, next) {

    // support token from cookie or Authorization header (Bearer token)
    const tokenFromCookie = req.cookies.token;
    const tokenFromHeader = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        return res.status(401).json({ message: "Please login first" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner not found" })
        }

        req.foodPartner = foodPartner

        next()

    } catch (err) {
        console.error('authFoodPartnerMiddleware error:', err);
        return res.status(401).json({ message: "Invalid token" })
    }

}

async function authUserMiddleware(req, res, next) {

    // support token from cookie or Authorization header (Bearer token)
    const tokenFromCookie = req.cookies.token;
    const tokenFromHeader = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        return res.status(401).json({ message: "Please login first" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = user

        next()

    } catch (err) {
        console.error('authUserMiddleware error:', err);
        return res.status(401).json({ message: "Invalid token" })
    }

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}