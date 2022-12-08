require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const app = express();

const { HTTP_PORT = 3000 } = process.env;

app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

// 404 Handler
app.use((req, res, next) => {
  return res.status(404).json({
    status: "false",
    message: "are you lost?",
  });
});
// 500 Handler
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).json({
    status: "false",
    message: err.message,
  });
});

app.listen(HTTP_PORT, () => console.log("listening on port", HTTP_PORT));
