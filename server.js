const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Simple in-memory user store for demo purposes
const USERS = {
  admin: 'password',
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
