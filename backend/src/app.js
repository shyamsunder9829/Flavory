// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();

// FRONTEND_URL can be a comma-separated list of allowed origins (e.g. "http://localhost:5173,https://your-site.netlify.app")
const FRONTEND_URLS = (process.env.FRONTEND_URL || "http://localhost:5173").split(',').map(s => s.trim());
console.log('Allowed frontend origins:', FRONTEND_URLS);
// trust proxy when running behind a proxy (Render, Heroku, etc.) so secure cookies work correctly
app.set('trust proxy', 1);

const corsOptions = {
    origin: (origin, callback) => {
        // allow non-browser requests like curl/postman (no origin)
        if (!origin) return callback(null, true);
        if (FRONTEND_URLS.includes(origin)) return callback(null, true);
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true,
};

app.use(cors(corsOptions));
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