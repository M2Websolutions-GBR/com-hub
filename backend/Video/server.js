const express = require("express");
const bodyParser = require("body-parser");
const videoRoutes = require("./routes/videos");
const db = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const client =require("prom-client");
const path = require("path");


require("dotenv").config();
db();
const app = express();

// Initialize Prometheus registry
const register = new client.Registry();

// Configure default Prometheus labels
register.setDefaultLabels({
    app: "video-svc",
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
app.get("/api/video/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
});



if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"))
}

const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));

// Serve uploaded videos and generated thumbnails to the frontend
const uploadsDir = process.env.FILE_UPLOAD_PATH || './public/uploads';
const thumbnailsDir = process.env.THUMBNAIL_OUTPUT_PATH || './public/thumbnails';
app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));
app.use('/thumbnails', express.static(path.join(__dirname, thumbnailsDir)));
app.use("/api/videos", videoRoutes);


app.listen(port, () => console.log(`Server running on port ${port}`));
