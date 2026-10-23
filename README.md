# Ponglisz 🇬🇧

Adaptacyjna platforma do nauki angielskiego dla dwóch osób:

| Profil | Specjalizacja |
|---|---|
| 🌋 **Jana** | geologia, ekologia i środowisko, nauka i laboratorium |
| 🏠 **Dominik** | nieruchomości, sprzedaż i obsługa klienta, prawo, umowy i finanse |

Obie osoby mają też wspólne podstawy: **codzienny angielski**, **zwroty do rozmowy**, tematy z życia (**Wrocław i zwiedzanie**, **snowboard i góry**, **gotowanie**) oraz **gramatykę** (20 tematów od A2 do B2). Każda osoba ma osobną zakładkę, własny kurs i własne postępy – synchronizowane między komputerem i telefonem.

## Co jest w środku

- **ok. 880 słów i wyrażeń** z przykładowymi zdaniami, w 4 poziomach (A2 → B1 → B1+ → B2)
- **20 lekcji gramatyki** z wyjaśnieniami po polsku i 200 ćwiczeniami (przykłady z geologii, nieruchomości, Wrocławia, stoku i kuchni)
- **12 tekstów do czytania** (po 4 dla Jany i Dominika + 4 wspólne: weekend we Wrocławiu, pierwszy dzień na snowboardzie, pierogi, Wrocław i powódź 1997) ze słowniczkiem i pytaniami
- **lekcje o różnej długości:** ⚡ szybka (~3 min), 📘 zwykła (~10 min), 🎓 długa (~20 min, z mini-lekcją gramatyki)
- **wymowa** – przycisk 🔊 czyta słowa, zdania i całe teksty (synteza mowy w przeglądarce)
- **test poziomujący** – ustala poziom startowy

## Jak system się dopasowuje

- **Powtórki w odstępach** (system pudełek): dobrze znane słowa wracają po 1, 2, 4, 7, 14, 30, 60 dniach, a słowa z błędami – jeszcze w tej samej sesji.
- **Coraz trudniejsze ćwiczenia** dla tego samego słowa: wybór tłumaczenia → wybór angielskiego słowa → uzupełnianie zdania → samodzielne wpisywanie (zwroty: układanie zdania ze słów).
- **Tempo**: przy ≥ 90% poprawnych odpowiedzi w sesji przybywa nowych słów (do 20 na sesję), przy < 60% – tempo spada.
- **Awans poziomu**: gdy skuteczność z ostatnich 40 odpowiedzi ≥ 85% i opanowana jest połowa materiału z bieżącego poziomu. Przy bardzo dobrych wynikach pojawiają się też „wyzwania” z wyższego poziomu.
- Na pulpicie widać: poziom, postęp do następnego, serię dni, skuteczność, wykres 14 dni, postęp w każdej talii i w gramatyce.

## Uruchomienie

To zwykła strona (HTML + CSS + JS). Lokalnie wystarczy otworzyć `public/index.html` w przeglądarce.

### Publikacja na ponglisz.io z logowaniem mailem (Cloudflare Workers)

Strona działa na **Cloudflare Workers** (pliki w `public/`, logika w `worker/index.js`, konfiguracja w `wrangler.jsonc`).
**Cloudflare Access** wpuszcza tylko dwa wskazane adresy e-mail – logowanie jednorazowym kodem z maila, bez haseł
(maile wysyła Cloudflare, własna skrzynka nie jest potrzebna). Postępy trzyma baza **Cloudflare D1**.
Worker przekierowuje wszystkie inne adresy (`*.workers.dev`, `www`) na `ponglisz.io` i niczego nie pokazuje bez zalogowania.

1. **Domena w Cloudflare:** *Add a site → Connect a domain → `ponglisz.io` → plan Free*, a w Hostingerze (*Domeny → ponglisz.io → DNS / Serwery nazw → Zmień serwery nazw*) wpisz dwa nameservery od Cloudflare. DNSSEC w Hostingerze ma być wyłączony.
2. **Wdrożenie:** *Workers & Pages → Create → Import a repository → `ponglisz`*. Pola zostaw domyślne (*Deploy command:* `npx wrangler deploy`, *Path:* `/`, *Build command* puste), *Enable Preview builds* można wyłączyć → **Deploy**. Każdy push do `main` wdraża się sam.
3. **Domena workera:** w workerze *Settings → Domains & Routes → Add → Custom domain* → `ponglisz.io` (Cloudflare zastąpi stary rekord A). To samo dla `www.ponglisz.io`. Jeśli VPS ma być dalej osiągalny, dodaj w DNS rekord A `vps` → IP serwera (szara chmurka).
4. **Logowanie:** *Zero Trust → Access → Applications → Add an application → Self-hosted*: domeny `ponglisz.io` i `www.ponglisz.io`, polityka *Allow → Include → Emails* (adresy Jany i Dominika), logowanie *One-time PIN*, czas sesji np. 1 miesiąc.
5. **Baza na postępy:** *Storage & Databases → D1 → Create* (nazwa `ponglisz`). Skopiuj jej **Database ID** i dopisz do `wrangler.jsonc`:
   ```jsonc
   "d1_databases": [{ "binding": "DB", "database_name": "ponglisz", "database_id": "<ID>" }],
   ```
   Tabela utworzy się sama.
6. **Zmienne** (worker → *Settings → Variables and Secrets*; zostają przy kolejnych wdrożeniach dzięki `keep_vars`):
   - `PROFILE_EMAILS` = `jana=adres-jany@…,dominik=adres-dominika@…` – po zalogowaniu każdy trafia od razu do swojej zakładki,
   - `ACCESS_TEAM_DOMAIN` = `twoj-zespol.cloudflareaccess.com` oraz `ACCESS_AUD` = *Application Audience (AUD) Tag* aplikacji w Access – dodatkowa weryfikacja podpisu logowania (zalecane).

Po zalogowaniu w stopce widać adres e-mail, stan synchronizacji i link **Wyloguj**.

Postępy zapisują się w przeglądarce (`localStorage`), a po wdrożeniu na Cloudflare także w bazie D1 – automatycznie, po lekcjach i przy zamknięciu karty. Bez internetu nauka działa dalej, a zmiany wyślą się później; postępy z dwóch urządzeń są łączone, więc nic nie ginie. Eksport/import w Ustawieniach zostaje jako kopia zapasowa.

Test lokalny z serwerem: `npx wrangler dev` (adres `localhost` omija logowanie).

## Dodawanie materiałów

- Słownictwo: `public/js/data/decks-*.js` – format `["angielski", "polski", poziom 1–4, "przykładowe zdanie"]`
- Gramatyka: `public/js/data/grammar.js`
- Teksty: `public/js/data/readings.js`
