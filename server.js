require("dotenv").config();
const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const db = require("./config/db.js");

require("./app/AutoLoader.js");

const PORT = process.env.PORT;

app.disable("x-powered-by");

mongoose.connect(db.connection).then(connection => {
  console.log("DB connected", connection?.connection?.host, connection?.connection?.name);
}).catch(error => {
  console.log("DB connection error", error?.reason);
});

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/static"));

app.use(bodyParser.json({ limit: "2048mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2048mb",
    extended: true,
    parameterLimit: "99999999999",
  })
);

// all server routes
app.use(require("./web/index.js"));

app.use(function (err, req, res, next) {
  if (err && err.stack) {
    return res.sendStatus(500);
  }
})

app.use(express.static('public'));
app.use("*",express.static(path.join(__dirname, 'public')));

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});

app.listen(PORT, function () {
  console.log(`Server started at port #${PORT}`);
});

// Developer Contacts
// Muhammad Shafiq
// aeceshfq@gmail.com
// +92 300 4870853