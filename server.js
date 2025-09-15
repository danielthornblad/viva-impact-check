const http = require('http');
const crypto = require('crypto');

const port = 3001;

// Simple in-memory user store with hashed password
const users = {
  // username: hashedPassword
  'admin': crypto.createHash('sha256').update('password123').digest('hex')
};

// In-memory session store
const sessions = {};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/auth/login') {
    try {
      const { username, password } = await parseBody(req);
      const storedHash = users[username];
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (!storedHash || storedHash !== passwordHash) {
        return send(res, 401, { message: 'Ogiltiga inloggningsuppgifter' });
      }
      const token = crypto.randomBytes(16).toString('hex');
      sessions[token] = username;
      return send(res, 200, { token });
    } catch (err) {
      return send(res, 400, { message: 'Felaktig begäran' });
    }
  }

  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return send(res, 401, { message: 'Token saknas' });
  }
  const token = auth.split(' ')[1];
  if (!sessions[token]) {
    return send(res, 401, { message: 'Ogiltig token' });
  }

  if (req.method === 'POST' && req.url === '/webhook') {
    return send(res, 200, { status: 'ok' });
  }

  return send(res, 404, { message: 'Sidan hittades inte' });
});

server.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});

