const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const sharedMiddleware = require("@comhub/middleware");
const authRoutes = require("./routes/auth");
const errorHandler = require("@comhub/middleware/error");
const client =require("prom-client");
const bodyParser = require("body-parser");

const DBConnection = require("./config/db");

dotenv.config({ path: "./config/.env" });

DBConnection();


const app = express();

// Initialize Prometheus registry
const register = new client.Registry();

// Configure default Prometheus labels
register.setDefaultLabels({
    app: "auth-svc",
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
app.get("/api/auth/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
});



app.use(bodyParser.json({ limit: '100mb' }));

app.use(express.json());
app.use(cookieParser());
app.use(sharedMiddleware);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"))
}

// Sanitize data
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

const apiprefix = (routeName) => `/api/${routeName}`;

app.use(apiprefix("auth"), authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`We are live on ${process.env.NODE_ENV} mode on port ${PORT}`);
});
