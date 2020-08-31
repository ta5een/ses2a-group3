const express = require('express');
const connectDb = require('../config/db');

const PORT = process.env.PORT || 5000;
const app = express();

// Connect database
connectDb();

// Init middleware
app.use(express.json({ extended: false }));

app.get('/', (_, res) => res.send('API Running...'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
