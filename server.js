const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
require("dotenv").config();

const app = express();

// Static files
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Home route
app.get("/", baseController.buildHome);

// Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Error middleware
app.use(async (err, req, res, next) => {
  console.error(err);
  const nav = await utilities.getNav();
  res.status(500).render("errors/error", {
    title: "Server Error",
    nav,
    message: err.message,
  });
});
