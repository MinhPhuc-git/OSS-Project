const http = require('node:http');
const { URL } = require('node:url');
const { Pool } = require('pg');

const port = Number(process.env.PORT || 3000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://oss_user:oss_demo_password@localhost:5432/oss_project',
});

const html = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      await pool.query('SELECT 1');
      return sendJson(response, 200, { status: 'ok', runtime: process.version, database: 'connected' });
    }

    if (request.method === 'GET' && url.pathname === '/api/notes') {
      const result = await pool.query('SELECT id, content, created_at FROM notes ORDER BY id DESC');
      return sendJson(response, 200, result.rows);
    }

    if (request.method === 'POST' && url.pathname === '/api/notes') {
      let body = '';
      for await (const chunk of request) body += chunk;
      const { content } = JSON.parse(body || '{}');
      if (typeof content !== 'string' || !content.trim()) {
        return sendJson(response, 400, { error: 'Nội dung ghi chú không được để trống.' });
      }
      const result = await pool.query(
        'INSERT INTO notes (content) VALUES ($1) RETURNING id, content, created_at',
        [html(content.trim()).slice(0, 2000)],
      );
      return sendJson(response, 201, result.rows[0]);
    }

    return sendJson(response, 404, { error: 'Không tìm thấy endpoint.' });
  } catch (error) {
    console.error(error);
    return sendJson(response, error instanceof SyntaxError ? 400 : 500, {
      error: error instanceof SyntaxError ? 'JSON không hợp lệ.' : 'Lỗi máy chủ.',
    });
  }
});

initializeDatabase()
  .then(() => server.listen(port, '0.0.0.0', () => console.log(`API đang chạy tại cổng ${port} (${process.version})`)))
  .catch((error) => {
    console.error('Không thể khởi tạo database:', error.message);
    process.exit(1);
  });

process.on('SIGTERM', () => server.close(() => pool.end()));
