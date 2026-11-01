/* Local test server: serves docs/ and stands in for the Google Apps Script server.
   Nothing here is published. The leader code is a throwaway value for local testing only. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'docs');
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml'};
const LEADER = 'local-test-code';
let rows = [];

function api(q) {
  if (q.op === 'submit') {
    if (!/^[01]{178}[1-7]{12}$/.test(q.answers)) return {error: 'invalid_request'};
    if (!rows.some(r => r.id === q.id)) rows.unshift({id: q.id, at: new Date().toISOString(), name: q.name, contact: q.contact, age: q.age, seconds: q.seconds, answers: q.answers});
    return {ok: true};
  }
  if (q.code !== LEADER) return {error: 'unauthorized'};
  if (q.op === 'list') return {candidates: rows};
  if (q.op === 'delete') { rows = rows.filter(r => r.id !== q.id); return {ok: true}; }
  return {error: 'invalid_request'};
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(api(JSON.parse(body)))); });
    return;
  }
  const url = req.url.split('?')[0];
  if (url === '/config.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end("window.CFG_CONFIG = {api: '/api'};"); }
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
  res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(5190, () => console.log('http://localhost:5190'));
