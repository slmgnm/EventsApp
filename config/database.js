// app.js or server.js
require("dotenv").config();

const mongoose = require("mongoose");
let db = mongoose.connect(
  
    process.env.MONGODB_URI || "mongodb://localhost:27017/eventsDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("connected to db succcesfuly...");
      }
    },
  );

