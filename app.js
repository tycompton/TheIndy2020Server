const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

require('dotenv').config()

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const typeRoutes = require('./routes/type');
const breweryRoutes = require('./routes/brewery');
const producerRoutes = require('./routes/producer');
const productRoutes = require('./routes/product');
const productWines = require('./routes/wine');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

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

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Middleware Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", typeRoutes);
app.use("/api", breweryRoutes);
app.use("/api", producerRoutes);
app.use("/api", productRoutes);
app.use("/api", productWines);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);


//======= SERVER ========
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});