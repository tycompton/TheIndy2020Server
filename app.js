const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// Import Routes
const userRoutes = require('./routes/user');

// APP 
const app = express();

// DB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected"));

// ROUTES MIDDLEWARE
app.use("/api", userRoutes)


// SERVER PORT
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});