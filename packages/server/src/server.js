const { port, mongoUri } = require("./config");
const routes = require("./routes");

const { json } = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(json());
app.use(helmet());
app.use(morgan("tiny"));

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB database");
  })
  .catch(error => {
    console.error(`An error occurred when connecting to MongoDB: ${error}`);
  });

app.use("/api/auth", routes.auth);
app.use("/api/users", routes.user);
app.use("/api/interests", routes.interest);

app.get("*", (_, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

// Catch unauthorised errors
app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized" });
  } else if (err) {
    console.error(`A server error occurred: ${err}`);
    res.status(400).json({ message: `${err.name}: ${err.message}` });
  }
});

app.listen(port, () => console.log(`Server started on port: ${port}`));
