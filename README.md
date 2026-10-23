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

To zwykła strona statyczna (HTML + CSS + JS) – bez instalacji i bez serwera.

- **Lokalnie:** otwórz `index.html` w przeglądarce.
- **Online (GitHub Pages):** w repozytorium *Settings → Pages → Source: Deploy from a branch → `main` / root*. Strona będzie pod adresem `https://<użytkownik>.github.io/ponglisz/`.

Postępy zapisują się w przeglądarce (`localStorage`), osobno dla każdej osoby. Aby przenieść je na inne urządzenie, użyj **Ustawienia → Eksportuj / Importuj**.

## Dodawanie materiałów

- Słownictwo: `js/data/decks-*.js` – format `["angielski", "polski", poziom 1–4, "przykładowe zdanie"]`
- Gramatyka: `js/data/grammar.js`
- Teksty: `js/data/readings.js`
