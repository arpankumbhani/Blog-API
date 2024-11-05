const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));
const path = require("path");

//load config from env file
require("dotenv").config();

//middleware to parse json request body
app.use(express.json());

app.use("/api/author", require("./routes/AuthorRoutes"));
app.use("/api/category", require("./routes/CategoryRoutes"));
app.use("/api/post", require("./routes/PostRoutes"));

// app.use("/authImg", express.static("authImg"));
// app.use("/postImages", express.static("postImages"));
app.use("/authImg", express.static(path.join(__dirname, "authImg")));
app.use("/postImages", express.static(path.join(__dirname, "postImages")));

app.get("/", (req, res) => {
  res.send({
    status: "okay",
  });
});

app.get("/ping", (req, res) => {
  res.send("ping🏓");
});

port = process.env.PORT || 8000;

app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on Port:", port);
  }
});

const dbConnect = require("./config/database");
dbConnect();
