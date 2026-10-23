/* Cloudflare Pages: strona ma być dostępna tylko pod ponglisz.io, gdzie chroni ją Cloudflare Access.
   Inne adresy (np. *.pages.dev) przekierowujemy na domenę główną, żeby nie dało się ominąć logowania. */
const CANONICAL = 'ponglisz.io';
const LOCAL = ['localhost', '127.0.0.1'];

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (LOCAL.includes(url.hostname)) return context.next();

  if (url.hostname !== CANONICAL) {
    url.protocol = 'https:';
    url.hostname = CANONICAL;
    url.port = '';
    return Response.redirect(url.toString(), 302);
  }

  // Cloudflare Access dokleja ten nagłówek do każdego zalogowanego żądania.
  // Jego brak oznacza, że Access nie jest (jeszcze) skonfigurowany – wtedy nic nie pokazujemy.
  if (!context.request.headers.get('Cf-Access-Jwt-Assertion')) {
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Brak dostępu</title>' +
      '<p style="font:16px system-ui;margin:3em auto;max-width:32em">Dostęp do Ponglisz wymaga zalogowania. ' +
      'Jeśli widzisz ten komunikat, ochrona Cloudflare Access nie jest jeszcze włączona dla ponglisz.io.</p>',
      { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
    );
  }

  return context.next();
}
