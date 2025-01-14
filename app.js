const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "6785d2961a702984412e463c",
  };
  next();
});
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
