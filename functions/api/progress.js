/* /api/progress?p=jana|dominik – postępy przechowywane w Cloudflare D1 (powiązanie o nazwie DB).
   GET  → { rev, state }  (state = null, jeśli jeszcze nic nie zapisano)
   PUT  ← { baseRev, state } → { rev }  albo 409 { rev, state }, gdy ktoś zapisał w międzyczasie. */
const PROFILES = ['jana', 'dominik'];
const MAX_BYTES = 900 * 1024;
const headers = { 'cache-control': 'no-store' };

async function ensureTable(db) {
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS progress (profile TEXT PRIMARY KEY, state TEXT NOT NULL, rev INTEGER NOT NULL, updated_at TEXT, updated_by TEXT)'
  ).run();
}

async function current(db, profile) {
  const row = await db.prepare('SELECT state, rev FROM progress WHERE profile = ?').bind(profile).first();
  return row ? { rev: row.rev, state: JSON.parse(row.state) } : { rev: 0, state: null };
}

export async function onRequest({ request, env, data }) {
  if (!env.DB) return Response.json({ error: 'no-db' }, { status: 501, headers });
  const profile = new URL(request.url).searchParams.get('p');
  if (!PROFILES.includes(profile)) return Response.json({ error: 'bad-profile' }, { status: 400, headers });
  await ensureTable(env.DB);

  if (request.method === 'GET') return Response.json(await current(env.DB, profile), { headers });

  if (request.method === 'PUT') {
    const body = await request.text();
    if (body.length > MAX_BYTES) return Response.json({ error: 'too-large' }, { status: 413, headers });
    let payload;
    try { payload = JSON.parse(body); } catch (e) { return Response.json({ error: 'bad-json' }, { status: 400, headers }); }
    const { baseRev, state } = payload || {};
    if (!state || typeof state !== 'object' || !Number.isInteger(baseRev)) {
      return Response.json({ error: 'bad-request' }, { status: 400, headers });
    }
    const json = JSON.stringify(state);
    const now = new Date().toISOString();
    const who = data.email || null;
    let res;
    if (baseRev === 0) {
      res = await env.DB.prepare(
        'INSERT INTO progress (profile, state, rev, updated_at, updated_by) VALUES (?, ?, 1, ?, ?) ON CONFLICT(profile) DO NOTHING'
      ).bind(profile, json, now, who).run();
    } else {
      res = await env.DB.prepare(
        'UPDATE progress SET state = ?, rev = rev + 1, updated_at = ?, updated_by = ? WHERE profile = ? AND rev = ?'
      ).bind(json, now, who, profile, baseRev).run();
    }
    if (!res.meta || !res.meta.changes) return Response.json(await current(env.DB, profile), { status: 409, headers });
    return Response.json({ rev: baseRev + 1 }, { headers });
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, PUT' } });
}
