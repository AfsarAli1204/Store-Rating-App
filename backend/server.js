const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/models');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./src/routes/auth.routes');
const storeRoutes = require('./src/routes/store.routes');
const ratingRoutes = require('./src/routes/rating.routes');
const adminRoutes = require('./src/routes/admin.routes');
const ownerRoutes = require('./src/routes/owner.routes');

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log('Database connected...');
    await db.sequelize.sync({ alter: true });
    console.log('Database & tables synced!');
  } catch (error) {
    console.error('Unable to connect/sync to the database:', error);
  }
});