const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/error');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const recordRouter = require('./routes/record.route');
const dashboardRouter = require('./routes/dashboard.route');

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(cors());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window`
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 2) ROUTES
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/records', recordRouter);
app.use('/api/dashboard', dashboardRouter);

const path = require('path');

// React static serving
app.use(express.static(path.join(__dirname, "build")));

// React Fallback Route (Must be after APIs and Static files)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
