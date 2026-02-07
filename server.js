/* ******************************************
 * server.js - Primary file for the application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const pool = require("./database/"); // Postgres pool
const utilities = require("./utilities/index");

const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const reviewRoute = require("./routes/reviewRoute");
const static = require("./routes/static");
const intentionalErrorRoute = require("./routes/intentionalErrorRoute");
const catchIntentionalError = require("./middleware/catchIntentionalError");

/* ***********************
 * Express App Setup
 *************************/
const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Static Files
app.use(express.static("public"));

// View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // layout path

/* ***********************
 * Session & Flash Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "someStrongSecretKey",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// JWT token check middleware (if used)
app.use(utilities.checkJWTToken);

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Review routes
app.use("/review", reviewRoute);

// Intentional error route (for testing)
app.use("/error", intentionalErrorRoute);

// Catch intentional errors middleware
app.use(catchIntentionalError);

/* ***********************
 * 404 Middleware
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    description: "Server Error Page.",
    nav,
  });
});

/* ***********************
 * Server Start
 *************************/
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
