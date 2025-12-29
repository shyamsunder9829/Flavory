// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();

// use FRONTEND_URL from environment in production, fallback to localhost in dev
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// trust proxy when running behind a proxy (Render, Heroku, etc.) so secure cookies work correctly
app.set('trust proxy', 1);
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Simple request logger to aid debugging
app.use((req, res, next) => {
    try {
        console.log('>>', req.method, req.path, { body: req.body, cookies: req.cookies });
    } catch (err) {
        console.error('request logger error:', err);
    }
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;