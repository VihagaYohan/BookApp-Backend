const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/Error");
const cors = require("cors");

// load env variables
dotenv.config({ path: "./config/config.env" });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// connect to database
connectDB();

// routes
const auth = require("./routes/Auth");


const app = express();
app.use(cors());
//app.use(express.static("public"));
app.use("/", express.static(path.resolve(__dirname, "docs")));
// body pharser
app.use(express.json());

//app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));
//app.use(homeRoutes.routes);

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// mount routers
app.use(errorHandler);
app.use("/api/auth", auth);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow
      .bold
  );
});

// handle un-handled promise re-jections
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error : ${error.message}`.red.bold);

  // close server and exit process
  server.close(() => process.exit(1));
});