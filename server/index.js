const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EventCraft API is running");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
  
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

app.use('/api/bookings', require('./routes/bookingRoutes'));

const { sendEventReminders } = require('./controllers/eventController');
setInterval(() => {
  sendEventReminders();
}, 15 * 60 * 1000);

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

app.use('/api/events', require('./routes/eventRoutes'));

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.use("/api/user", require("./routes/userRoutes"));