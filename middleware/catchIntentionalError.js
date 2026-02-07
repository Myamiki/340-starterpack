// middleware/catchIntentionalError.js
// Handles intentionally triggered errors and renders a custom error page.
// Passes all other errors to the global error handler.

const utilities = require("../utilities");

module.exports = async (err, req, res, next) => {
  try {
    // Only intercept intentional error routes
    if (
      req.originalUrl &&
      (req.originalUrl === "/error/trigger-error" ||
        req.originalUrl.startsWith("/error"))
    ) {
      const nav = await utilities.getNav();

      console.error(
        `Intentional Error Handler: ${req.originalUrl} → ${err.message}`
      );

      return res.status(err.status || 500).render("errors/error", {
        title: "Server Error",
        nav,
        message:
          "An internal server error was intentionally triggered for testing purposes.",
        description: "This is the intentional 500-type error page.",
      });
    }

    // Not an intentional error → forward it
    return next(err);
  } catch (renderError) {
    // If rendering fails, forward original error
    return next(err);
  }
};