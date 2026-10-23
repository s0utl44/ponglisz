# Ponglisz 🇬🇧

Adaptacyjna platforma do nauki angielskiego dla dwóch osób:

| Profil | Specjalizacja |
|---|---|
| 🌋 **Jana** | geologia, ekologia i środowisko, nauka i laboratorium |
| 🏠 **Dominik** | nieruchomości, sprzedaż i obsługa klienta, prawo, umowy i finanse |

Obie osoby mają też wspólne podstawy: **codzienny angielski**, **zwroty do rozmowy** i **gramatykę** (20 tematów od A2 do B2). Każda osoba ma osobną zakładkę, własny kurs i własne postępy.

## Co jest w środku

- **ok. 710 słów i wyrażeń** z przykładowymi zdaniami, w 4 poziomach (A2 → B1 → B1+ → B2)
- **20 lekcji gramatyki** z wyjaśnieniami po polsku i testami (przykłady z geologii i nieruchomości)
- **8 tekstów do czytania** (po 4 na osobę, od prostych po specjalistyczne) ze słowniczkiem i pytaniami
- **wymowa** – przycisk 🔊 czyta słowa, zdania i całe teksty (synteza mowy w przeglądarce)
- **test poziomujący** – ustala poziom startowy

## Jak system się dopasowuje

- **Powtórki w odstępach** (system pudełek): dobrze znane słowa wracają po 1, 2, 4, 7, 14, 30, 60 dniach, a słowa z błędami – jeszcze w tej samej sesji.
- **Coraz trudniejsze ćwiczenia** dla tego samego słowa: wybór tłumaczenia → wybór angielskiego słowa → uzupełnianie zdania → samodzielne wpisywanie (zwroty: układanie zdania ze słów).
- **Tempo**: przy ≥ 90% poprawnych odpowiedzi w sesji przybywa nowych słów (do 20 na sesję), przy < 60% – tempo spada.
- **Awans poziomu**: gdy skuteczność z ostatnich 40 odpowiedzi ≥ 85% i opanowana jest połowa materiału z bieżącego poziomu. Przy bardzo dobrych wynikach pojawiają się też „wyzwania” z wyższego poziomu.
- Na pulpicie widać: poziom, postęp do następnego, serię dni, skuteczność, wykres 14 dni, postęp w każdej talii i w gramatyce.

## Uruchomienie

To zwykła strona statyczna (HTML + CSS + JS). Lokalnie wystarczy otworzyć `index.html` w przeglądarce.

### Publikacja na ponglisz.io z logowaniem mailem (Cloudflare)

Strona jest hostowana na **Cloudflare Pages**, a **Cloudflare Access** wpuszcza tylko dwa wskazane adresy e-mail
(logowanie jednorazowym kodem wysyłanym na maila, bez haseł). Plik `functions/_middleware.js` przekierowuje
wszystkie inne adresy (np. `*.pages.dev`) na `ponglisz.io` i blokuje stronę, dopóki Access nie jest włączony.

1. **Domena w Cloudflare:** dash.cloudflare.com → *Add a domain* → `ponglisz.io` (plan Free) → u rejestratora domeny zmień serwery DNS (nameservers) na te podane przez Cloudflare.
2. **Hosting:** *Workers & Pages → Create → Pages → Connect to Git* → repozytorium `ponglisz`, gałąź `main`, *Framework preset: None*, polecenie budowania puste, katalog wyjściowy `/`.
3. **Domena strony:** w projekcie Pages → *Custom domains* → dodaj `ponglisz.io`.
4. **Logowanie:** *Zero Trust* (przy pierwszym wejściu wybierz plan Free) → *Access → Applications → Add an application → Self-hosted*:
   - domena: `ponglisz.io`,
   - polityka: *Action: Allow*, *Include → Emails* → dwa adresy (Jany i Dominika),
   - metoda logowania: *One-time PIN* (włączona domyślnie),
   - czas sesji np. 1 miesiąc, żeby nie logować się codziennie.
5. Jeśli wcześniej włączono **GitHub Pages**, wyłącz je (*Settings → Pages → Unpublish*). W przeciwnym razie strona byłaby dostępna bez logowania pod adresem github.io. Warto też ustawić repozytorium jako prywatne – Cloudflare Pages działa z prywatnymi repozytoriami.

Po zalogowaniu w stopce widać adres e-mail i link **Wyloguj**.

Postępy zapisują się w przeglądarce (`localStorage`), osobno dla każdej osoby. Aby przenieść je na inne urządzenie, użyj **Ustawienia → Eksportuj / Importuj**.

## Dodawanie materiałów

- Słownictwo: `js/data/decks-*.js` – format `["angielski", "polski", poziom 1–4, "przykładowe zdanie"]`
- Gramatyka: `js/data/grammar.js`
- Teksty: `js/data/readings.js`
