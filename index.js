const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(
  dotenv.config({
    path: "./.env",
  })
);

const { app } = require("./app");
const { connectMongoDb } = require("./db");

connectMongoDb((error, client) => {
  if (error) {
    console.log("Something went wrong while connecting to the database");
    console.error(error);
    process.exit(1);
  }

  console.log("Connected to the mongodb");

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.HOSTNAME}`);
  });
});
