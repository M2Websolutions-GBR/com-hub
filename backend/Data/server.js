const express = require('express');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const replyRoutes = require('./routes/replies');
const feelingRoutes = require('./routes/feelings');
const subscriptionRoutes = require('./routes/subscriptions')
const historiesRoutes = require('./routes/histories')
const searchRoutes = require('./routes/search')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const errorHandler = require('@comhub/middleware/error')
const DBConnection = require('./config/db')
const client =require("prom-client");
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser')


dotenv.config({ path: './config/.env' })
const app = express();

// Initialize Prometheus registry
const register = new client.Registry();

// Configure default Prometheus labels
register.setDefaultLabels({
    app: "data-svc",
});

// Define Prometheus metrics
const http_request_counter = new client.Counter({
    name: 'myapp_http_request_count',
    help: 'Count of HTTP requests',
    labelNames: ['method', 'route', 'statusCode']
});

// Register Prometheus metrics with the registry
register.registerMetric(http_request_counter);

// Collect default Prometheus metrics (e.g., CPU, memory)
client.collectDefaultMetrics({
    register
});

// Middleware to count HTTP requests and log metrics
app.use("/*",async function(req, res, next) {
    http_request_counter.labels({
        method: req.method,
        route: req.originalUrl,
        statusCode: res.statusCode
    }).inc();
    console.log("register metrics",await register.metrics());
    next();
});

// Middleware to collect and expose Prometheus metrics
app.get("/api/data/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
});









DBConnection()
app.use(bodyParser.json({ limit: '100mb' }));

app.use(express.json())
// app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"))
}


// Sanitize data
app.use(mongoSanitize())

// Enable CORS
app.use(cors())





const apiPrefix = (routeName) => `/api/data/${routeName}`


app.use(apiPrefix('users'), userRoutes)
app.use(apiPrefix('categories'), categoryRoutes)
app.use(apiPrefix('videos'), videoRoutes)
app.use(apiPrefix('comments'), commentRoutes)
app.use(apiPrefix('replies'), replyRoutes)
app.use(apiPrefix('feelings'), feelingRoutes)
app.use(apiPrefix('subscriptions'), subscriptionRoutes)
app.use(apiPrefix('histories'), historiesRoutes)
app.use(apiPrefix('search'), searchRoutes)

app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(
        `We are live on ${process.env.NODE_ENV} mode on port ${PORT}`
    )
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server & exit process
    server.close(() => process.exit(1))
})
