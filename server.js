const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const user = require("./routes/api/user");
const friend = require("./routes/api/friend");
const event = require("./routes/api/event");
const bill = require("./routes/api/bill");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;
//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.log(error));

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport.js")(passport);

//use routes
app.use("/api/user", user);
app.use("/api/friend", friend);
app.use("/api/event", event);
app.use("/api/bill", bill);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
