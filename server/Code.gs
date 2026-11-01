/* Career Finding Guide server (Google Apps Script).
   Saves candidate answers to a private Google Sheet and returns them only with the leader code.

   Script properties (Project Settings > Script properties):
     LEADER_CODE    required, at least 10 characters; the code leaders sign in with
     DAILY_LIMIT    optional, most submissions accepted per day (default 200)
*/
var ANSWER_PATTERN = /^[01]{178}[1-7]{12}$/;
var HEADERS = ['id', 'submitted_at', 'name', 'contact', 'age', 'seconds', 'answers'];

function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }
function setProp(k, v) { PropertiesService.getScriptProperties().setProperty(k, String(v)); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function fail(code) { var e = new Error(code); e.appCode = code; throw e; }

function doGet() { return reply({ok: true, app: 'Career Finding Guide'}); }

function doPost(e) {
  try {
    return reply(handle(JSON.parse(e.postData.contents)));
  } catch (err) {
    if (err.appCode) return reply({error: err.appCode});
    console.error('server error: ' + (err && err.name));
    return reply({error: 'server_error'});
  }
}

function handle(q) {
  if (q.op === 'submit') return submit(q);
  checkLeader(String(q.code || ''));
  switch (q.op) {
    case 'login': return {ok: true};
    case 'list': return {candidates: listCandidates()};
    case 'delete': deleteCandidate(String(q.id || '')); return {ok: true};
  }
  fail('invalid_request');
}

function checkLeader(code) {
  var cache = CacheService.getScriptCache(), fails = +(cache.get('fails') || 0);
  if (fails >= 20) fail('locked');
  var leader = prop('LEADER_CODE');
  if (leader.length >= 10 && code === leader) return;
  cache.put('fails', String(fails + 1), 900);
  Utilities.sleep(800);
  fail('unauthorized');
}

function sheet() {
  var id = prop('SHEET_ID');
  if (id) { try { return SpreadsheetApp.openById(id).getSheets()[0]; } catch (e) {} }
  var book = SpreadsheetApp.create('Career Finding Guide Results'), s = book.getSheets()[0];
  s.appendRow(HEADERS); s.setFrozenRows(1);
  setProp('SHEET_ID', book.getId());
  return s;
}

function underDailyLimit() {
  var day = Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd');
  var used = prop('day') === day ? +prop('used') : 0, limit = +prop('DAILY_LIMIT') || 200;
  if (used >= limit) fail('daily_limit');
  setProp('day', day); setProp('used', used + 1);
}

function submit(q) {
  var id = String(q.id || ''), name = String(q.name || '').trim(), contact = String(q.contact || '').trim();
  var age = +q.age, answers = String(q.answers || ''), seconds = Math.max(0, Math.round(+q.seconds || 0));
  if (q.website) return {ok: true};   // hidden field only bots fill in
  if (!/^[\w-]{8,40}$/.test(id) || !name || name.length > 80 || !/^[\d+\-\s()]{7,20}$/.test(contact)) fail('invalid_request');
  if (!(age >= 15 && age <= 90) || !ANSWER_PATTERN.test(answers) || q.consent !== true) fail('invalid_request');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var s = sheet();
    if (s.createTextFinder(id).matchEntireCell(true).findNext()) return {ok: true};   // retried submission
    underDailyLimit();
    // The leading apostrophe keeps each value as plain text in the Sheet.
    s.appendRow(["'" + id, new Date().toISOString(), "'" + name, "'" + contact, Math.round(age), seconds, "'" + answers]);
  } finally { lock.releaseLock(); }
  return {ok: true};
}

function listCandidates() {
  var rows = sheet().getDataRange().getValues().slice(1), out = [];
  rows.forEach(function (r) {
    if (!ANSWER_PATTERN.test(String(r[6])) || isNaN(new Date(r[1]))) return;   // skip rows edited by hand
    out.push({id: String(r[0]), at: new Date(r[1]).toISOString(), name: String(r[2]), contact: String(r[3]), age: r[4], seconds: r[5], answers: String(r[6])});
  });
  return out.reverse();
}

function deleteCandidate(id) {
  if (!id) fail('invalid_request');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var s = sheet(), hit = s.createTextFinder(id).matchEntireCell(true).findNext();
    if (hit && hit.getColumn() === 1) s.deleteRow(hit.getRow());
  } finally { lock.releaseLock(); }
}

/* Run once from the editor to create the results Sheet and approve access. */
function setup() { console.log('Ready: ' + sheet().getParent().getUrl()); }
