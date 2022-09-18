const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(
  dotenv.config({
    path: "./.env",
  })
);

const { initApp } = require("./app");
const { connectMongoDb } = require("./db");

connectMongoDb((error) => {
  if (error) {
    console.log("Something went wrong while connecting to the database");
    console.error(error);
    process.exit(1);
  }

  console.log("Connected to the mongodb");

  // Use initApp to create the app and then start the server
  // because we need to connect to the database first
  // then connect to Redis
  // then start the server
  initApp()
    .then((app) => {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.HOSTNAME}`);
      });
    })
    .catch((error) => {
      console.log("Something went wrong while initializing the app");
      console.error(error);
      process.exit(1);
    });
});
