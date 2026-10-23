/* GET /api/me – kto jest zalogowany i czy działa zapis postępów w chmurze.
   Zmienna PROFILE_EMAILS (opcjonalna), np. "jana=jana@example.com,dominik=dominik@example.com",
   pozwala od razu otwierać właściwą zakładkę po zalogowaniu. */
export async function onRequestGet({ env, data }) {
  const email = data.email || null;
  let profile = null;
  String(env.PROFILE_EMAILS || '').split(',').forEach(pair => {
    const [p, e] = pair.split('=').map(s => s && s.trim().toLowerCase());
    if (p && e && e === email) profile = p;
  });
  return Response.json({ email, profile, sync: !!env.DB }, { headers: { 'cache-control': 'no-store' } });
}
