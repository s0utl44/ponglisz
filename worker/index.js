/* Ponglisz na Cloudflare Workers.
   - strona działa tylko pod ponglisz.io, gdzie chroni ją Cloudflare Access (logowanie kodem z maila);
     inne adresy (workers.dev, www) przekierowujemy na domenę główną,
   - bez tokenu Access nic nie pokazujemy; jeśli ustawiono ACCESS_TEAM_DOMAIN i ACCESS_AUD,
     podpis tokenu jest dodatkowo weryfikowany,
   - /api/me i /api/progress obsługują synchronizację postępów w bazie D1 (powiązanie DB). */
const CANONICAL = 'ponglisz.io';
const LOCAL = ['localhost', '127.0.0.1'];
const PROFILES = ['jana', 'dominik'];
const MAX_BYTES = 900 * 1024;
const NO_STORE = { 'cache-control': 'no-store' };

// ---------- logowanie (Cloudflare Access) ----------
let certCache = { at: 0, keys: [] };

const b64url = s => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
};
const jsonPart = s => JSON.parse(new TextDecoder().decode(b64url(s)));

async function verifyToken(token, env) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('bad token');
  const header = jsonPart(parts[0]);
  const payload = jsonPart(parts[1]);

  if (env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD) {
    const team = env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (Date.now() - certCache.at > 3600e3 || !certCache.keys.some(k => k.kid === header.kid)) {
      const r = await fetch(`https://${team}/cdn-cgi/access/certs`);
      certCache = { at: Date.now(), keys: (await r.json()).keys || [] };
    }
    const jwk = certCache.keys.find(k => k.kid === header.kid);
    if (!jwk) throw new Error('unknown key');
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!ok) throw new Error('bad signature');
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!aud.includes(env.ACCESS_AUD)) throw new Error('bad audience');
    if (payload.iss !== `https://${team}`) throw new Error('bad issuer');
  }
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error('expired');
  if (!payload.email) throw new Error('no email');
  return String(payload.email).toLowerCase();
}

const denied = () => new Response(
  '<!doctype html><meta charset="utf-8"><title>Brak dostępu</title>' +
  '<p style="font:16px system-ui;margin:3em auto;max-width:32em">Dostęp do Ponglisz wymaga zalogowania. ' +
  'Jeśli widzisz ten komunikat, ochrona Cloudflare Access nie jest jeszcze włączona dla ponglisz.io.</p>',
  { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', ...NO_STORE } }
);

// ---------- API ----------
function apiMe(env, email) {
  let profile = null;
  String(env.PROFILE_EMAILS || '').split(',').forEach(pair => {
    const [p, e] = pair.split('=').map(s => s && s.trim().toLowerCase());
    if (p && e && e === email) profile = p;
  });
  return Response.json({ email, profile, sync: !!env.DB }, { headers: NO_STORE });
}

async function current(db, profile) {
  const row = await db.prepare('SELECT state, rev FROM progress WHERE profile = ?').bind(profile).first();
  return row ? { rev: row.rev, state: JSON.parse(row.state) } : { rev: 0, state: null };
}

/* GET  /api/progress?p=… → { rev, state }
   PUT  /api/progress?p=… ← { baseRev, state } → { rev } albo 409 { rev, state }, gdy ktoś zapisał w międzyczasie */
async function apiProgress(request, env, email) {
  if (!env.DB) return Response.json({ error: 'no-db' }, { status: 501, headers: NO_STORE });
  const profile = new URL(request.url).searchParams.get('p');
  if (!PROFILES.includes(profile)) return Response.json({ error: 'bad-profile' }, { status: 400, headers: NO_STORE });
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS progress (profile TEXT PRIMARY KEY, state TEXT NOT NULL, rev INTEGER NOT NULL, updated_at TEXT, updated_by TEXT)'
  ).run();

  if (request.method === 'GET') return Response.json(await current(env.DB, profile), { headers: NO_STORE });

  if (request.method === 'PUT') {
    const body = await request.text();
    if (body.length > MAX_BYTES) return Response.json({ error: 'too-large' }, { status: 413, headers: NO_STORE });
    let payload;
    try { payload = JSON.parse(body); } catch (e) { return Response.json({ error: 'bad-json' }, { status: 400, headers: NO_STORE }); }
    const { baseRev, state } = payload || {};
    if (!state || typeof state !== 'object' || !Number.isInteger(baseRev)) {
      return Response.json({ error: 'bad-request' }, { status: 400, headers: NO_STORE });
    }
    const json = JSON.stringify(state);
    const now = new Date().toISOString();
    const res = baseRev === 0
      ? await env.DB.prepare(
        'INSERT INTO progress (profile, state, rev, updated_at, updated_by) VALUES (?, ?, 1, ?, ?) ON CONFLICT(profile) DO NOTHING'
      ).bind(profile, json, now, email).run()
      : await env.DB.prepare(
        'UPDATE progress SET state = ?, rev = rev + 1, updated_at = ?, updated_by = ? WHERE profile = ? AND rev = ?'
      ).bind(json, now, email, profile, baseRev).run();
    if (!res.meta || !res.meta.changes) return Response.json(await current(env.DB, profile), { status: 409, headers: NO_STORE });
    return Response.json({ rev: baseRev + 1 }, { headers: NO_STORE });
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, PUT' } });
}

// ---------- główna obsługa ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let email;

    if (LOCAL.includes(url.hostname)) {
      email = 'dev@localhost';
    } else {
      if (url.hostname !== CANONICAL) {
        url.protocol = 'https:';
        url.hostname = CANONICAL;
        url.port = '';
        return Response.redirect(url.toString(), 302);
      }
      const token = request.headers.get('Cf-Access-Jwt-Assertion');
      if (!token) return denied();
      try { email = await verifyToken(token, env); } catch (e) { return denied(); }
    }

    if (url.pathname === '/api/me') return apiMe(env, email);
    if (url.pathname === '/api/progress') return apiProgress(request, env, email);
    return env.ASSETS.fetch(request);
  }
};
