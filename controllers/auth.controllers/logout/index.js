module.exports = async (req, res, next) => {
  // delete user from session, and regenerate session
  req.session.user = null;

  req.session.save((error) => {
    if (error) return next(error);

    req.session.regenerate((error) => {
      if (error) return next(error);
      return res.status(204).json({
        status: "ok",
        code: "logged_out",
        message: "Logged out",
      });
    });
  });
};
