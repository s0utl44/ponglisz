/* Cloudflare Pages: strona jest dostępna tylko pod ponglisz.io, gdzie chroni ją Cloudflare Access.
   - inne adresy (np. *.pages.dev) przekierowujemy na domenę główną, żeby nie dało się ominąć logowania,
   - bez tokenu Access nic nie pokazujemy,
   - jeśli ustawiono ACCESS_TEAM_DOMAIN i ACCESS_AUD, podpis tokenu jest dodatkowo weryfikowany.
   Zalogowany e-mail trafia do context.data.email (używa go API postępów). */
const CANONICAL = 'ponglisz.io';
const LOCAL = ['localhost', '127.0.0.1'];

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
  { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
);

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (LOCAL.includes(url.hostname)) {
    context.data.email = 'dev@localhost';
    return context.next();
  }

  if (url.hostname !== CANONICAL) {
    url.protocol = 'https:';
    url.hostname = CANONICAL;
    url.port = '';
    return Response.redirect(url.toString(), 302);
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return denied();
  try {
    context.data.email = await verifyToken(token, env);
  } catch (e) {
    return denied();
  }
  return context.next();
}
