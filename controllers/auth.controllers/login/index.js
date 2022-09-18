const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const { UsersCollection } = require("../../../db/collections");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || !email.trim() || !password.trim()) {
    return res.status(400).json({
      status: "fail",
      code: "invalid_req_body",
      message: "Invalid email or password",
    });
  }

  const user = await UsersCollection.findOne(
    { email: email.toLowerCase().trim() },
    { projection: { _id: 1, email: 1, password: 1 } }
  );

  if (!user) {
    return res.status(400).json({
      status: "fail",
      code: "user_not_found",
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      status: "fail",
      code: "invalid_password",
      message: "Invalid password",
    });
  }

  // store user in session
  req.session.regenerate((error) => {
    if (error) return next(error);

    req.session.user = { _id: user._id };

    req.session.save((error) => {
      if (error) return next(error);

      return res.status(200).json({
        status: "success",
        code: "ok",
        message: "User logged in",
        user: {
          ...user,
          password: undefined,
        },
      });
    });
  });
};
