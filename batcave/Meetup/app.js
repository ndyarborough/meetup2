const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT;

// Initialize Express app
const app = express();
// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.DBHOST}:27017/meetup`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res => {
  console.log('Database connected')
  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
}
).catch(err => console.log(err));

//enable cors
app.use(cors({ origin: "*"}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// User routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/user', userRoutes);
app.use('/event', eventRoutes);

    // Noah Was Here


