/* Gramatyka – wspólna dla obu osób, przykłady mieszają geologię i nieruchomości.
   Ćwiczenie: { q, o: [opcje], a: indeks poprawnej, e: wyjaśnienie }
   albo wpisywane: { q, a: ["poprawna", "wariant"], e } */
window.GRAMMAR = [
  {
    id: 'be-present', lvl: 1, title: 'Present Simple i „to be”',
    intro: `
<p><b>To be</b> (być): <i>I am</i>, <i>you / we / they are</i>, <i>he / she / it is</i>.
Przeczenie: <i>isn't / aren't</i>, pytanie: <i>Is it…? Are they…?</i></p>
<p><b>Present Simple</b> – nawyki, fakty, rzeczy stałe i prawdy naukowe.</p>
<ul>
<li>he / she / it → końcówka <b>-s / -es</b>: <i>She work<b>s</b> in real estate.</i></li>
<li>przeczenie i pytanie z <b>do / does</b>: <i>He <b>doesn't</b> live here. <b>Does</b> the flat have a lift?</i></li>
<li>po <i>does / doesn't</i> czasownik <b>bez -s</b>: <i>Does she work…?</i> (nie: <s>Does she works</s>)</li>
<li>fakty naukowe: <i>Water boils at 100°C. Quartz scratches glass.</i></li>
</ul>
<p>Słowa-sygnały: <i>always, usually, often, sometimes, never, every day</i>.</p>`,
    ex: [
      { q: "Granite ___ an igneous rock.", o: ["is", "are", "be", "am"], a: 0 },
      { q: "She ___ in a real estate agency.", o: ["work", "works", "working", "is work"], a: 1, e: "he / she / it → końcówka -s." },
      { q: "___ you live near the city centre?", o: ["Does", "Are", "Do", "Is"], a: 2 },
      { q: "Water ___ at 100°C.", o: ["boil", "boils", "is boiling", "boiling"], a: 1, e: "Fakt naukowy → Present Simple." },
      { q: "The flat ___ have a balcony.", o: ["don't", "isn't", "doesn't", "not"], a: 2 },
      { q: "They ___ from Poland.", o: ["is", "are", "am", "be"], a: 1 },
      { q: "How often ___ he visit clients?", o: ["do", "does", "is", "has"], a: 1 },
      { q: "Wpisz: My brother ___ (study) geology.", a: ["studies"], e: "study → studies (spółgłoska + y → -ies)." }
    ]
  },
  {
    id: 'pres-cont', lvl: 1, title: 'Present Continuous vs Present Simple',
    intro: `
<p><b>Present Continuous</b> (<i>am / is / are + -ing</i>) – coś dzieje się <b>teraz</b> albo <b>tymczasowo</b> w tym okresie.</p>
<ul>
<li><i>Look! The volcano <b>is erupting</b>.</i></li>
<li><i>I<b>'m learning</b> English this year.</i> (sytuacja przejściowa)</li>
<li>zmiany i trendy: <i>Prices <b>are rising</b>.</i></li>
</ul>
<p><b>Present Simple</b> – rutyna, fakty, stałe sytuacje: <i>I usually <b>go</b> to work by bus.</i></p>
<p><b>Czasowniki stanu</b> (know, understand, like, want, believe, own, belong) zwykle <b>nie</b> występują w Continuous:
<i>I <b>understand</b></i> (nie: <s>I'm understanding</s>).</p>
<p>Sygnały: <i>now, at the moment, currently, this week, Look!, Listen!</i></p>`,
    ex: [
      { q: "Look! The volcano ___ smoke.", o: ["emits", "is emitting", "emit", "emitting"], a: 1 },
      { q: "I usually ___ to work by bus.", o: ["go", "am going", "goes", "going"], a: 0 },
      { q: "At the moment we ___ a new flat for a client.", o: ["look for", "are looking for", "looks for", "looked for"], a: 1 },
      { q: "She ___ English this year because she wants a better job.", o: ["learns", "is learning", "learn", "has learn"], a: 1, e: "Sytuacja tymczasowa, trwająca w tym okresie → Continuous." },
      { q: "Rivers ___ into seas or oceans.", o: ["flow", "are flowing", "flows", "is flowing"], a: 0, e: "Ogólna prawda → Present Simple." },
      { q: "I ___ what you mean.", o: ["am understanding", "understand", "understanding", "understands"], a: 1, e: "understand to czasownik stanu – bez Continuous." },
      { q: "Why ___ you ___? Is something funny?", o: ["do / laugh", "are / laughing", "is / laughing", "does / laugh"], a: 1 },
      { q: "Wpisz (2 słowa): Prices ___ (rise) quickly this year.", a: ["are rising", "'re rising"] }
    ]
  },
  {
    id: 'past-simple', lvl: 1, title: 'Past Simple',
    intro: `
<p><b>Past Simple</b> – zakończona czynność w przeszłości, często z określeniem czasu: <i>yesterday, last week, in 2019, two years ago</i>.</p>
<ul>
<li>regularne: <b>-ed</b> → <i>show<b>ed</b>, happen<b>ed</b>, analys<b>ed</b></i></li>
<li>nieregularne trzeba zapamiętać: <i>go → went, buy → bought, find → found, leave → left, sell → sold</i></li>
<li>przeczenie i pytanie z <b>did</b> + forma podstawowa: <i>I <b>didn't send</b> it. Where <b>did</b> you <b>find</b> it?</i></li>
<li>to be: <i>I / he / she / it <b>was</b>, you / we / they <b>were</b></i></li>
</ul>`,
    ex: [
      { q: "Yesterday we ___ three flats.", o: ["show", "showed", "shown", "showing"], a: 1 },
      { q: "The earthquake ___ in 2011.", o: ["happen", "happens", "happened", "was happen"], a: 2 },
      { q: "I ___ the email last night.", o: ["didn't send", "didn't sent", "not sent", "don't sent"], a: 0, e: "Po did / didn't czasownik w formie podstawowej." },
      { q: "Where ___ you ___ the samples?", o: ["did / find", "did / found", "do / found", "was / find"], a: 0 },
      { q: "They ___ the house in 2019.", o: ["buyed", "bought", "boughted", "buy"], a: 1 },
      { q: "We ___ to the mountains last summer.", o: ["go", "went", "gone", "goed"], a: 1 },
      { q: "The client ___ happy with the offer.", o: ["were", "was", "did", "be"], a: 1 },
      { q: "Wpisz formę przeszłą: The glacier ___ (leave) huge boulders.", a: ["left"] }
    ]
  },
  {
    id: 'articles', lvl: 1, title: 'Przedimki a / an / the',
    intro: `
<p>W polskim nie ma przedimków, dlatego to częsty błąd.</p>
<ul>
<li><b>a / an</b> – jedna rzecz, wspomniana po raz pierwszy, „jakaś”: <i>I saw <b>a</b> house.</i> <b>an</b> przed samogłoską w wymowie: <i>an hour, an estate agent</i>.</li>
<li><b>the</b> – konkretna, znana rzecz, już wspomniana, jedyna w swoim rodzaju: <i><b>The</b> house had a garden. <b>The</b> Sun.</i></li>
<li>Stopień najwyższy: <i><b>the</b> highest mountain</i>.</li>
<li><b>Bez przedimka</b>: rzeczowniki niepoliczalne i liczba mnoga w znaczeniu ogólnym (<i>Water is essential. Minerals are…</i>), większość krajów i miast (<i>Poland, Kraków</i>).</li>
<li>Zawody: <i>She is <b>a</b> geologist. He is <b>an</b> estate agent.</i></li>
</ul>`,
    ex: [
      { q: "I need ___ umbrella.", o: ["a", "an", "the", "—"], a: 1 },
      { q: "___ Sun is a star.", o: ["A", "An", "The", "—"], a: 2 },
      { q: "She is ___ estate agent.", o: ["a", "an", "the", "—"], a: 1 },
      { q: "We saw ___ beautiful house. ___ house had a big garden.", o: ["a / The", "the / A", "a / A", "the / The"], a: 0 },
      { q: "___ water is essential for life.", o: ["A", "The", "—", "An"], a: 2, e: "Niepoliczalny rzeczownik w sensie ogólnym – bez przedimka." },
      { q: "Mount Everest is ___ highest mountain in the world.", o: ["a", "the", "—", "an"], a: 1 },
      { q: "I live in ___ Poland.", o: ["the", "a", "—", "an"], a: 2 },
      { q: "It takes about ___ hour.", o: ["a", "an", "the", "—"], a: 1, e: "hour wymawiamy /aʊə/ – samogłoska, więc an." }
    ]
  },
  {
    id: 'quantifiers', lvl: 1, title: 'Policzalne i niepoliczalne: much / many / some / any',
    intro: `
<ul>
<li><b>many / a few / few</b> – z rzeczownikami policzalnymi: <i>many rooms, a few fossils</i></li>
<li><b>much / a little / little</b> – z niepoliczalnymi: <i>much money, a little time</i></li>
<li><b>a lot of</b> – z oboma rodzajami.</li>
<li><b>some</b> – zdania twierdzące i prośby/propozycje: <i>Could I have some information?</i></li>
<li><b>any</b> – przeczenia i pytania: <i>There isn't any milk. Are there any questions?</i></li>
</ul>
<p>Uwaga, niepoliczalne w angielskim: <i>advice, information, furniture, equipment, research, evidence, news, luggage</i> – nie mają liczby mnogiej i nie łączą się z <i>a/an</i>.</p>
<p><i>a few / a little</i> = trochę (pozytywnie), <i>few / little</i> = mało (negatywnie).</p>`,
    ex: [
      { q: "How ___ money do you have?", o: ["many", "much", "a lot", "few"], a: 1 },
      { q: "How ___ rooms are there?", o: ["much", "many", "lot", "little"], a: 1 },
      { q: "There isn't ___ milk left.", o: ["some", "any", "many", "a"], a: 1 },
      { q: "Could I have ___ information about the flat?", o: ["an", "some", "many", "a few"], a: 1 },
      { q: "We found ___ fossils in the cliff.", o: ["a few", "a little", "much", "an"], a: 0 },
      { q: "There is ___ sand in my shoes.", o: ["many", "a few", "some", "a"], a: 2 },
      { q: "Can you give me ___ advice?", o: ["an", "a", "some", "many"], a: 2, e: "advice jest niepoliczalne – nie mówimy „an advice”." },
      { q: "Hurry up, we have very ___ time.", o: ["few", "little", "many", "a few"], a: 1 }
    ]
  },
  {
    id: 'comparatives', lvl: 1, title: 'Stopniowanie przymiotników',
    intro: `
<ul>
<li>krótkie przymiotniki: <b>-er / -est</b> → <i>big → bigger → the biggest, hard → harder → the hardest</i></li>
<li>długie: <b>more / the most</b> → <i>expensive → more expensive → the most expensive</i></li>
<li>nieregularne: <i>good → better → the best, bad → worse → the worst, far → further → the furthest</i></li>
<li>porównanie: <b>than</b> → <i>Quartz is harder <b>than</b> calcite.</i></li>
<li>równość: <b>as … as</b> → <i>not as quiet as the suburbs</i></li>
<li><b>the more…, the better…</b> → <i>The more you practise, the better you get.</i></li>
</ul>`,
    ex: [
      { q: "This flat is ___ than the other one.", o: ["big", "bigger", "more big", "biggest"], a: 1 },
      { q: "Diamond is ___ mineral.", o: ["the hardest", "the most hard", "harder", "hardest"], a: 0 },
      { q: "The new house is ___ expensive than I expected.", o: ["more", "most", "much", "many"], a: 0 },
      { q: "This is the ___ location in the city.", o: ["better", "best", "good", "goodest"], a: 1 },
      { q: "The weather today is ___ than yesterday.", o: ["worse", "worst", "badder", "more bad"], a: 0 },
      { q: "This area is not ___ quiet ___ the suburbs.", o: ["as / as", "so / than", "more / than", "as / than"], a: 0 },
      { q: "The ___ you practise, the ___ you get.", o: ["more / better", "most / best", "much / good", "more / good"], a: 0 },
      { q: "Wpisz: Basalt is ___ (heavy) than pumice.", a: ["heavier"] }
    ]
  },
  {
    id: 'future', lvl: 2, title: 'Przyszłość: will / going to / Present Continuous',
    intro: `
<ul>
<li><b>will</b> – spontaniczne decyzje, obietnice, przewidywania (opinie): <i>I'<b>ll</b> help you. I think prices <b>will</b> rise.</i></li>
<li><b>be going to</b> – plany i zamiary; przewidywania na podstawie dowodów: <i>Look at those clouds – it's <b>going to</b> rain.</i></li>
<li><b>Present Continuous</b> – ustalone terminy, spotkania w kalendarzu: <i>We<b>'re meeting</b> the client at 10 tomorrow.</i></li>
<li><b>Present Simple</b> – rozkłady jazdy: <i>The train <b>leaves</b> at 7:45.</i></li>
</ul>
<p>Po <i>when, as soon as, before, after, if</i> mówiąc o przyszłości używamy czasu <b>teraźniejszego</b>: <i>I'll call you when I <b>get</b> home.</i></p>`,
    ex: [
      { q: "Look at those clouds! It ___ rain.", o: ["will", "is going to", "goes to", "rains"], a: 1, e: "Przewidywanie na podstawie dowodów → going to." },
      { q: "This box is heavy. – Wait, I ___ help you.", o: ["am going to", "will", "help", "am helping"], a: 1, e: "Spontaniczna decyzja → will." },
      { q: "We ___ the client at 10 tomorrow. It's in my calendar.", o: ["meet", "are meeting", "will meeting", "meets"], a: 1, e: "Umówione spotkanie → Present Continuous." },
      { q: "The train ___ at 7:45.", o: ["leaves", "is leaving to", "will leaving", "leave"], a: 0, e: "Rozkład jazdy → Present Simple." },
      { q: "I think prices ___ next year.", o: ["rise", "will rise", "are rise", "rising"], a: 1 },
      { q: "___ you help me with this report, please?", o: ["Will", "Are", "Do going", "Shall to"], a: 0 },
      { q: "I'll call you when I ___ home.", o: ["will get", "get", "am going to get", "got"], a: 1, e: "Po when w zdaniu o przyszłości – czas teraźniejszy." },
      { q: "Wpisz (Present Continuous): We ___ (visit) the quarry next Monday – it's all arranged.", a: ["are visiting", "'re visiting"] }
    ]
  },
  {
    id: 'present-perfect', lvl: 2, title: 'Present Perfect vs Past Simple',
    intro: `
<p><b>Present Perfect</b> (<i>have / has + III forma</i>) łączy przeszłość z teraźniejszością:</p>
<ul>
<li>doświadczenia życiowe: <i>Have you <b>ever</b> seen a volcano?</i></li>
<li>skutek widoczny teraz: <i>I've lost my keys.</i></li>
<li>trwanie do teraz: <i>We've lived here <b>for</b> ten years / <b>since</b> 2015.</i></li>
<li>z <i>just, already, yet, this year, so far</i>.</li>
</ul>
<p><b>Past Simple</b> – gdy podajemy <b>konkretny czas w przeszłości</b>: <i>She sold the flat <b>last week</b>.</i></p>
<p><b>for</b> + okres (for two years), <b>since</b> + punkt w czasie (since Monday, since 2020).</p>`,
    ex: [
      { q: "I ___ never ___ a volcano.", o: ["have / seen", "did / see", "have / saw", "am / seen"], a: 0 },
      { q: "She ___ the flat last week.", o: ["has sold", "sold", "has sell", "sells"], a: 1, e: "Konkretny czas (last week) → Past Simple." },
      { q: "We ___ here since 2020.", o: ["live", "lived", "have lived", "are living"], a: 2 },
      { q: "___ you ever ___ to London?", o: ["Did / be", "Have / been", "Have / went", "Were / been"], a: 1 },
      { q: "They ___ the contract yet.", o: ["didn't sign", "haven't signed", "don't sign", "hasn't signed"], a: 1 },
      { q: "I've known him ___ ten years.", o: ["since", "for", "from", "ago"], a: 1 },
      { q: "The price ___ by 10% this year.", o: ["has increased", "increased ago", "increase", "have increased"], a: 0 },
      { q: "Wpisz III formę: I have just ___ (finish) the report.", a: ["finished"] }
    ]
  },
  {
    id: 'modals', lvl: 2, title: 'Czasowniki modalne',
    intro: `
<ul>
<li><b>must</b> – musisz (obowiązek, często od mówiącego / przepis); <b>mustn't</b> – <b>nie wolno</b>.</li>
<li><b>have to</b> – trzeba (obowiązek z zewnątrz); <b>don't have to</b> – <b>nie musisz</b> (ale możesz).</li>
<li><b>should</b> – powinieneś (rada).</li>
<li><b>can / could</b> – umiejętność, możliwość, prośba; <i>could</i> – też przeszłość i grzeczniejsze prośby.</li>
<li><b>might / may</b> – może (prawdopodobieństwo).</li>
</ul>
<p>Po modalnych czasownik <b>bez „to”</b>: <i>You should <b>see</b></i> (nie: <s>should to see</s>). Wyjątek: <i>have to, ought to</i>.</p>`,
    ex: [
      { q: "You ___ wear a helmet on the construction site. It's the law.", o: ["must", "might", "could", "would"], a: 0 },
      { q: "You ___ pay now. You can pay next week.", o: ["mustn't", "don't have to", "can't", "shouldn't to"], a: 1, e: "don't have to = nie musisz; mustn't = nie wolno." },
      { q: "You ___ eat or drink in the laboratory.", o: ["don't have to", "mustn't", "needn't", "might"], a: 1 },
      { q: "You ___ see a doctor if you feel bad.", o: ["should", "should to", "must to", "ought"], a: 0 },
      { q: "It ___ rain later, so take an umbrella.", o: ["might", "must", "has to", "shall"], a: 0 },
      { q: "___ I ask you a question?", o: ["Can", "Must", "Should to", "Have"], a: 0 },
      { q: "I ___ swim when I was five.", o: ["can", "could", "might", "must"], a: 1 },
      { q: "The buyer ___ to get a mortgage first.", o: ["must", "has", "should", "can"], a: 1, e: "has to + bezokolicznik." }
    ]
  },
  {
    id: 'prepositions', lvl: 2, title: 'Przyimki czasu i miejsca',
    intro: `
<p><b>Czas:</b></p>
<ul>
<li><b>at</b> – godziny i punkty: <i>at 5 o'clock, at night, at the weekend (BrE)</i></li>
<li><b>on</b> – dni i daty: <i>on Monday, on 3rd May</i></li>
<li><b>in</b> – miesiące, lata, pory roku, dłuższe okresy: <i>in July, in 1998, in the morning</i></li>
</ul>
<p><b>Miejsce:</b></p>
<ul>
<li><b>at</b> – punkt / miejsce, w którym coś się dzieje: <i>at the office, at the bottom, at a hotel</i></li>
<li><b>on</b> – na powierzchni, piętra: <i>on the table, on the third floor</i></li>
<li><b>in</b> – wewnątrz, w obszarze: <i>in the box, in Kraków, in the valley</i></li>
</ul>
<p>Przyimki po przymiotnikach: <i>interested <b>in</b>, good <b>at</b>, afraid <b>of</b>, responsible <b>for</b></i>.</p>`,
    ex: [
      { q: "The meeting is ___ Monday.", o: ["in", "on", "at", "by"], a: 1 },
      { q: "I'll see you ___ 5 o'clock.", o: ["in", "on", "at", "to"], a: 2 },
      { q: "The house was built ___ 1998.", o: ["on", "at", "in", "by"], a: 2 },
      { q: "The keys are ___ the table.", o: ["on", "in", "at", "over"], a: 0 },
      { q: "She lives ___ the third floor.", o: ["in", "at", "on", "by"], a: 2 },
      { q: "The fossils were found ___ the bottom of the lake.", o: ["on", "in", "at", "by"], a: 2 },
      { q: "We stayed ___ a hotel near the coast.", o: ["on", "at", "by", "to"], a: 1 },
      { q: "I'm interested ___ geology.", o: ["on", "at", "in", "about"], a: 2 }
    ]
  },
  {
    id: 'past-cont', lvl: 2, title: 'Past Continuous',
    intro: `
<p><b>Past Continuous</b> (<i>was / were + -ing</i>) – czynność <b>w trakcie</b> w danym momencie przeszłości, często przerwana przez krótszą (Past Simple).</p>
<ul>
<li><i>I <b>was writing</b> a report when the phone <b>rang</b>.</i></li>
<li><i><b>While</b> we <b>were examining</b> the cliff, it <b>started</b> to rain.</i></li>
<li><i>What <b>were</b> you <b>doing</b> at 8 p.m. yesterday?</i></li>
</ul>
<p><b>when</b> + zwykle krótka czynność (Past Simple), <b>while</b> + dłuższa (Past Continuous).</p>`,
    ex: [
      { q: "I ___ a report when the phone rang.", o: ["wrote", "was writing", "have written", "were writing"], a: 1 },
      { q: "While we ___ the cliff, it started to rain.", o: ["were examining", "examined", "are examining", "was examining"], a: 0 },
      { q: "What ___ you doing at 8 p.m. yesterday?", o: ["did", "were", "was", "are"], a: 1 },
      { q: "The client arrived while I ___ the flat.", o: ["cleaned", "was cleaning", "clean", "am cleaning"], a: 1 },
      { q: "When the earthquake ___, people were sleeping.", o: ["was hitting", "hit", "hits", "were hitting"], a: 1 },
      { q: "She ___ for the bus when I saw her.", o: ["waited", "was waiting", "waits", "were waiting"], a: 1 },
      { q: "It ___ all day yesterday.", o: ["was raining", "were raining", "rain", "is raining"], a: 0 },
      { q: "Wpisz (2 słowa): They ___ (talk) about the price when the owner came in.", a: ["were talking"] }
    ]
  },
  {
    id: 'cond-01', lvl: 2, title: 'Zdania warunkowe 0 i 1',
    intro: `
<p><b>Zero conditional</b> – prawdy ogólne, prawa natury: <i>If + Present Simple, Present Simple</i></p>
<p><i>If you heat ice, it <b>melts</b>. If you add acid to limestone, it <b>fizzes</b>.</i></p>
<p><b>First conditional</b> – realna przyszłość: <i>If + Present Simple, will + czasownik</i></p>
<p><i>If the buyer <b>accepts</b> the offer, we <b>will sign</b> the contract.</i></p>
<p>W części z <i>if</i> <b>nie</b> używamy <i>will</i>. <b>unless</b> = <i>if not</i>: <i>Unless you hurry, you'll miss the train.</i></p>`,
    ex: [
      { q: "If you heat ice, it ___.", o: ["melts", "will melt", "melted", "would melt"], a: 0, e: "Zero conditional – prawda ogólna." },
      { q: "If the buyer ___ the offer, we will sign the contract.", o: ["accepts", "will accept", "accepted", "accept"], a: 0 },
      { q: "If it rains tomorrow, we ___ the field trip.", o: ["cancel", "will cancel", "would cancel", "cancelled"], a: 1 },
      { q: "Unless you ___, you'll miss the train.", o: ["hurry", "will hurry", "don't hurry", "hurried"], a: 0, e: "unless = if not, więc bez dodatkowego przeczenia." },
      { q: "If you add acid to limestone, it ___.", o: ["fizzes", "would fizz", "fizzed", "will fizzing"], a: 0 },
      { q: "I'll call you if I ___ any news.", o: ["will have", "have", "had", "having"], a: 1 },
      { q: "If prices ___, more people will rent.", o: ["go up", "will go up", "went up", "goes up"], a: 0 },
      { q: "Wpisz: If you ___ (not / sign) today, the offer will expire.", a: ["don't sign", "do not sign"] }
    ]
  },
  {
    id: 'cond-23', lvl: 3, title: 'Zdania warunkowe 2 i 3, „I wish”',
    intro: `
<p><b>Second conditional</b> – sytuacje nierealne / hipotetyczne teraz: <i>If + Past Simple, would + czasownik</i></p>
<p><i>If I <b>had</b> more money, I <b>would buy</b> a house by the sea. If I <b>were</b> you, I'd accept the offer.</i></p>
<p><b>Third conditional</b> – nierealna przeszłość (żal, krytyka): <i>If + Past Perfect, would have + III forma</i></p>
<p><i>If we <b>had checked</b> the data, we <b>would have noticed</b> the mistake.</i></p>
<p><b>I wish + Past Simple</b> – żałuję czegoś teraz: <i>I wish I <b>spoke</b> English better.</i></p>`,
    ex: [
      { q: "If I ___ more money, I would buy a house by the sea.", o: ["have", "had", "would have", "has"], a: 1 },
      { q: "If I were you, I ___ that offer.", o: ["will accept", "would accept", "accepted", "accept"], a: 1 },
      { q: "If we had checked the data, we ___ the mistake.", o: ["would notice", "would have noticed", "will notice", "had noticed"], a: 1 },
      { q: "If she ___ earlier, she would have caught the train.", o: ["left", "had left", "would leave", "has left"], a: 1 },
      { q: "What would you do if you ___ the lottery?", o: ["win", "won", "would win", "had won"], a: 1 },
      { q: "If the dam ___ built, the valley would have flooded.", o: ["hadn't been", "wasn't", "wouldn't be", "hasn't been"], a: 0 },
      { q: "I wish I ___ English better.", o: ["speak", "spoke", "will speak", "speaking"], a: 1 },
      { q: "If they had lowered the price, we ___ the flat.", o: ["would buy", "would have bought", "bought", "will buy"], a: 1 }
    ]
  },
  {
    id: 'passive', lvl: 3, title: 'Strona bierna (Passive Voice)',
    intro: `
<p>Kluczowa w tekstach naukowych i umowach! Używamy jej, gdy ważniejsze jest <b>co się dzieje</b> niż <b>kto to robi</b>.</p>
<p>Budowa: <b>be</b> (w odpowiednim czasie) + <b>III forma</b></p>
<ul>
<li>Present: <i>English <b>is spoken</b> worldwide.</i></li>
<li>Past: <i>The samples <b>were analysed</b> last week.</i></li>
<li>Present Perfect: <i>The flat <b>has been sold</b>.</i></li>
<li>Future: <i>The contract <b>will be signed</b> tomorrow.</i></li>
<li>Continuous: <i>New roads <b>are being built</b>.</i></li>
</ul>
<p>Wykonawcę dodajemy przez <b>by</b>: <i>The fossil was found <b>by</b> a student.</i></p>`,
    ex: [
      { q: "The samples ___ in the laboratory last week.", o: ["analysed", "were analysed", "was analysed", "are analysing"], a: 1 },
      { q: "English ___ all over the world.", o: ["speaks", "is spoken", "is speaking", "spoken"], a: 1 },
      { q: "The house ___ in 1920.", o: ["built", "was built", "is built", "has build"], a: 1 },
      { q: "The contract ___ tomorrow.", o: ["will sign", "will be signed", "is signing", "signs"], a: 1 },
      { q: "The flat ___ already ___.", o: ["has / been sold", "is / sold", "was / selling", "has / sold"], a: 0 },
      { q: "Limestone ___ mainly of calcite.", o: ["composes", "is composed", "composed", "is composing"], a: 1 },
      { q: "New roads ___ at the moment.", o: ["are built", "are being built", "build", "have built"], a: 1 },
      { q: "Wpisz (2 słowa): The fossils ___ (discover) in 1995.", a: ["were discovered"] }
    ]
  },
  {
    id: 'relative', lvl: 3, title: 'Zdania względne: who / which / that / whose / where',
    intro: `
<ul>
<li><b>who</b> – ludzie: <i>The agent <b>who</b> sold our house…</i></li>
<li><b>which</b> – rzeczy: <i>The rock <b>which</b> contains fossils…</i></li>
<li><b>that</b> – ludzie lub rzeczy (tylko w zdaniach definiujących, bez przecinków)</li>
<li><b>whose</b> – czyj: <i>The client <b>whose</b> flat we sold…</i></li>
<li><b>where</b> – miejsce, <b>when</b> – czas</li>
</ul>
<p>W zdaniach <b>wtrąconych</b> (z przecinkami) nie używamy <i>that</i>: <i>Granite, <b>which</b> is very hard, is used in construction.</i></p>
<p>Gdy zaimek jest dopełnieniem, można go pominąć: <i>the report (that) you mentioned</i>.</p>
<p><b>What</b> = „to, co”: <i><b>What</b> I need is a holiday.</i></p>`,
    ex: [
      { q: "The agent ___ sold our house was very helpful.", o: ["which", "who", "whose", "where"], a: 1 },
      { q: "This is the rock ___ contains fossils.", o: ["who", "which", "whose", "where"], a: 1 },
      { q: "That's the village ___ I grew up.", o: ["which", "where", "who", "when"], a: 1 },
      { q: "The client ___ flat we sold is moving abroad.", o: ["who", "whose", "which", "that's"], a: 1 },
      { q: "Granite, ___ is very hard, is used in construction.", o: ["that", "which", "what", "who"], a: 1, e: "W zdaniach wtrąconych (z przecinkami) nie używamy that." },
      { q: "I remember the day ___ we bought this house.", o: ["when", "where", "which", "whose"], a: 0 },
      { q: "Is this the report ___ you were talking about?", o: ["what", "(that)", "who", "where"], a: 1 },
      { q: "___ I need is a good night's sleep.", o: ["That", "What", "Which", "Who"], a: 1 }
    ]
  },
  {
    id: 'gerund-inf', lvl: 3, title: 'Gerund (-ing) czy bezokolicznik (to + verb)?',
    intro: `
<ul>
<li><b>-ing</b> po: <i>enjoy, mind, avoid, finish, suggest, consider, keep</i> oraz <b>po przyimkach</b> (<i>good at negotiating, interested in buying, look forward to meeting</i>).</li>
<li><b>to + czasownik</b> po: <i>want, decide, plan, hope, agree, offer, manage, need, would like</i>.</li>
<li>Zmiana znaczenia:
  <ul>
  <li><i>stop doing</i> – przestać; <i>stop to do</i> – zatrzymać się, żeby coś zrobić</li>
  <li><i>remember to do</i> – pamiętać, żeby coś zrobić; <i>remember doing</i> – pamiętać, że się zrobiło</li>
  </ul>
</li>
</ul>`,
    ex: [
      { q: "I enjoy ___ in the mountains.", o: ["to hike", "hiking", "hike", "hiked"], a: 1 },
      { q: "We decided ___ the flat.", o: ["buying", "to buy", "buy", "bought"], a: 1 },
      { q: "She is good at ___ with clients.", o: ["negotiate", "to negotiate", "negotiating", "negotiated"], a: 2, e: "Po przyimku → -ing." },
      { q: "I'm looking forward to ___ you.", o: ["meet", "meeting", "to meet", "met"], a: 1, e: "„to” jest tu przyimkiem, więc -ing." },
      { q: "They want ___ a new office.", o: ["opening", "open", "to open", "opened"], a: 2 },
      { q: "Would you mind ___ the window?", o: ["to close", "closing", "close", "closed"], a: 1 },
      { q: "I stopped ___ coffee because of my heart.", o: ["to drink", "drinking", "drink", "drank"], a: 1, e: "stop doing = przestać coś robić." },
      { q: "Remember ___ the door when you leave.", o: ["locking", "to lock", "lock", "locked"], a: 1 }
    ]
  },
  {
    id: 'ppc', lvl: 3, title: 'Present Perfect Continuous',
    intro: `
<p><b>have / has been + -ing</b> – czynność trwa od jakiegoś czasu do teraz (nacisk na <b>czas trwania</b> lub ślady czynności).</p>
<ul>
<li><i>We<b>'ve been drilling</b> for six hours.</i></li>
<li><i>She's tired because she<b>'s been working</b> all day.</i></li>
<li><i>How long <b>have</b> you <b>been learning</b> English?</i></li>
</ul>
<p>Gdy mówimy o <b>wyniku / liczbie</b> – Present Perfect Simple: <i>We've seen <b>three</b> flats today.</i></p>
<p>Czasowniki stanu (know, own, believe) – tylko Simple: <i>I've <b>known</b> him since 2015.</i></p>`,
    ex: [
      { q: "I ___ for you for an hour!", o: ["wait", "have been waiting", "am waiting", "waited"], a: 1 },
      { q: "How long ___ you ___ English?", o: ["have / been learning", "did / learn", "are / learning", "do / learn"], a: 0 },
      { q: "She's tired because she ___ all day.", o: ["has worked", "has been working", "worked", "is working"], a: 1 },
      { q: "We ___ three flats today.", o: ["have been seeing", "have seen", "are seeing", "saw"], a: 1, e: "Liczba / wynik → Present Perfect Simple." },
      { q: "It ___ since morning.", o: ["rains", "is raining", "has been raining", "rained"], a: 2 },
      { q: "The team ___ this site for five years.", o: ["has been studying", "studies", "is studying", "studied"], a: 0 },
      { q: "I ___ him since 2015.", o: ["have been knowing", "have known", "know", "knew"], a: 1, e: "know – czasownik stanu, bez Continuous." },
      { q: "Wpisz (3 słowa): They ___ (drill) for six hours and still haven't reached the bedrock.", a: ["have been drilling", "'ve been drilling"] }
    ]
  },
  {
    id: 'reported', lvl: 4, title: 'Mowa zależna (Reported Speech)',
    intro: `
<p>Relacjonując czyjeś słowa po <i>said / told</i>, zwykle „cofamy” czas o jeden krok:</p>
<ul>
<li>Present Simple → Past Simple: <i>"I am tired." → She said she <b>was</b> tired.</i></li>
<li>Past Simple / Present Perfect → Past Perfect: <i>"We sold it." → They said they <b>had sold</b> it.</i></li>
<li>will → <b>would</b>, can → <b>could</b></li>
</ul>
<p>Pytania zależne mają <b>szyk zdania twierdzącego</b>: <i>She asked where I <b>lived</b></i> (nie: <s>where did I live</s>). Pytania tak/nie → <b>if / whether</b>.</p>
<p>Polecenia: <i>told / asked + someone + <b>to</b> do / <b>not to</b> do</i>.</p>
<p><b>said</b> bez osoby, <b>told</b> z osobą: <i>He said that… / He told me that…</i></p>`,
    ex: [
      { q: "She said, \"I am tired.\" → She said that she ___ tired.", o: ["is", "was", "has been", "be"], a: 1 },
      { q: "He said, \"I will call you.\" → He said he ___ call me.", o: ["will", "would", "shall", "can"], a: 1 },
      { q: "\"We sold the house.\" → They said they ___ the house.", o: ["sold", "had sold", "have sold", "sell"], a: 1 },
      { q: "She asked me where I ___.", o: ["live", "lived", "do live", "did live"], a: 1, e: "Pytanie zależne – szyk zdania twierdzącego." },
      { q: "He asked if I ___ the report.", o: ["had finished", "have I finished", "did finish", "finish"], a: 0 },
      { q: "The agent told us ___ the kitchen first.", o: ["see", "to see", "seeing", "saw"], a: 1 },
      { q: "\"Can you help me?\" → She asked if I ___ help her.", o: ["can", "could", "will", "may to"], a: 1 },
      { q: "\"Don't touch the samples.\" → He told us ___ the samples.", o: ["don't touch", "not to touch", "to not touching", "no touch"], a: 1 }
    ]
  },
  {
    id: 'linking', lvl: 4, title: 'Spójniki i łączniki (however, despite, whereas…)',
    intro: `
<ul>
<li><b>although / even though</b> + zdanie: <i>Although it was expensive, they bought it.</i></li>
<li><b>despite / in spite of</b> + rzeczownik lub -ing: <i>Despite the high price…</i></li>
<li><b>however</b> – na początku nowego zdania, z przecinkiem: <i>The flat is small. However, it's bright.</i></li>
<li><b>whereas</b> – kontrast dwóch faktów: <i>Sandstone is permeable, whereas shale is not.</i></li>
<li><b>therefore / consequently</b> – skutek; <b>moreover / furthermore</b> – dodanie argumentu</li>
<li><b>due to / because of</b> + rzeczownik; <b>because</b> + zdanie</li>
<li><b>according to</b> – według</li>
</ul>`,
    ex: [
      { q: "The flat is small. ___, it's in a great location.", o: ["However", "Because", "Although", "Despite"], a: 0 },
      { q: "___ the high price, they bought the house.", o: ["Although", "Despite", "However", "Even"], a: 1 },
      { q: "___ it was expensive, they bought it.", o: ["Despite", "In spite", "Although", "However"], a: 2 },
      { q: "The rock is porous; ___, water can flow through it.", o: ["therefore", "whereas", "although", "despite"], a: 0 },
      { q: "Sandstone is permeable, ___ shale is not.", o: ["whereas", "therefore", "despite", "moreover"], a: 0 },
      { q: "The location is excellent. ___, the price is reasonable.", o: ["Moreover", "Whereas", "Despite", "Unless"], a: 0 },
      { q: "We postponed the trip ___ the storm.", o: ["because", "due to", "although", "since that"], a: 1 },
      { q: "___ to the report, groundwater levels are falling.", o: ["According", "Regarding", "Due", "Despite"], a: 0 }
    ]
  },
  {
    id: 'hedging', lvl: 4, title: 'Język ostrożny i formalny (hedging)',
    intro: `
<p>W raportach, artykułach naukowych i rozmowach z klientem unikamy zbyt kategorycznych stwierdzeń.</p>
<ul>
<li>czasowniki: <i>suggest, indicate, appear, seem, tend to</i> – <i>The results <b>suggest</b> that…</i></li>
<li>modalne: <i>may, might, could</i> – <i>The data <b>may</b> be incomplete.</i></li>
<li><i>be likely / unlikely to</i>, <i>be expected to</i> – <i>Prices are <b>likely to</b> rise.</i></li>
<li>przysłówki: <i>generally, relatively, approximately, possibly</i></li>
<li>uprzejme propozycje: <i>I would suggest that…, It might be worth…</i></li>
</ul>`,
    ex: [
      { q: "The results ___ that the fault is still active.", o: ["suggest", "are suggesting to", "suggests", "suggesting"], a: 0 },
      { q: "It is ___ that prices will fall next year.", o: ["unlikely", "unlike", "likely to", "dislike"], a: 0 },
      { q: "The data ___ be incomplete.", o: ["may", "must to", "is", "can to"], a: 0 },
      { q: "This ___ to be the oldest rock in the region.", o: ["appears", "seems it", "appear", "is appearing"], a: 0 },
      { q: "The property is ___ to increase in value.", o: ["expected", "expecting", "expect", "expectation"], a: 0 },
      { q: "___ speaking, the market is stable.", o: ["Generally", "General", "Generality", "In general"], a: 0 },
      { q: "There is ___ evidence of contamination.", o: ["little", "few", "a few", "many"], a: 0, e: "evidence jest niepoliczalne → little." },
      { q: "I would ___ that we review the contract again.", o: ["suggest", "suggesting", "to suggest", "suggested"], a: 0 }
    ]
  }
];
