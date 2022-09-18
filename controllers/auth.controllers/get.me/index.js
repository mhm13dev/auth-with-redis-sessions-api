const { ObjectId } = require("mongodb");

const { UsersCollection } = require("../../../db/collections");

module.exports = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: "fail",
      code: "unauthorized",
      message: "Unauthorized",
    });
  }

  const user = await UsersCollection.findOne(
    { _id: new ObjectId(req.session.user._id) },
    { projection: { password: 0 } }
  );

  if (!user) {
    // delete user from session, and regenerate session
    req.session.user = null;

    req.session.save((error) => {
      if (error) return next(error);

      req.session.regenerate((error) => {
        if (error) return next(error);
        return res.status(401).json({
          status: "fail",
          code: "unauthorized",
          message: "Unauthorized",
        });
      });
    });
  } else {
    return res.status(200).json({
      status: "success",
      code: "ok",
      message: "User data",
      user,
    });
  }
};
