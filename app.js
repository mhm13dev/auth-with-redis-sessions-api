const express = require("express");
const session = require("express-session");
const { createClient } = require("redis");
const RedisStore = require("connect-redis")(session);
const cors = require("cors");

const apiRouter = require("./routes");

async function initApp() {
  // Connect to Redis
  const redisClient = createClient({
    url: process.env.REDIS_URL,
    legacyMode: true,
  });

  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:");
    console.log(err);
    process.exit(1);
  }

  const app = express();

  // Cors
  const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(","),
    credentials: true,
  };
  app.options(cors(corsOptions));
  app.use(cors(corsOptions));

  if (process.env.NODE_ENV === "production") {
    // For using cookies in production when secure: true and app is behind proxy
    app.set("trust proxy", 1); // trust first proxy
  }

  // session middleware
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.COOKIES_SECRET,
      resave: false,
      saveUninitialized: false,
      name: "redis.sid",
      cookie: {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge:
          Number(process.env.SESSION_COOKIE_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000,
        domain: process.env.COOKIES_DOMAIN,
        sameSite: "lax",
      },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.get("/", (req, res) => {
    res.status(200).json({
      status: "success",
      code: "server_running",
      message: "Server is running",
    });
  });

  app.use((_, res) => {
    res.status(404).json({
      status: "fail",
      code: "not_found",
      message: "Not found",
    });
  });

  app.use((_, _1, res) => {
    res.status(500).json({
      status: "error",
      code: "server_error",
      message: "Something went wrong",
    });
  });

  return app;
}

module.exports = {
  initApp,
};
