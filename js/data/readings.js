/* Teksty do czytania – osobne dla Jany i Dominika, rosnący poziom. */
window.READINGS = {
  jana: [
    {
      id: 'j-field-day', lvl: 1, title: 'A Day in the Field',
      text: `Anna is a young geologist. Today she is working in the field, near a small river in the mountains. She gets up at six o'clock and drives to the valley. The weather is cold but sunny.

First, she looks at the rocks near the river. There are many layers of sandstone and clay. She takes photos and writes notes in her notebook. Then she uses her hammer to collect small samples. She puts each sample in a bag and writes a number on it.

At lunchtime she eats a sandwich and drinks hot tea. In the afternoon, she finds a fossil of a small shell in a layer of limestone. She is very happy! This fossil is millions of years old.

In the evening, Anna goes back to the office. Tomorrow she will send the samples to the laboratory.`,
      gloss: { field: 'teren (prace terenowe)', valley: 'dolina', layers: 'warstwy', sandstone: 'piaskowiec', clay: 'glina', samples: 'próbki', fossil: 'skamieniałość', shell: 'muszla', limestone: 'wapień' },
      q: [
        { q: 'Where is Anna working today?', o: ['In an office', 'Near a river in the mountains', 'In a laboratory', 'At the seaside'], a: 1 },
        { q: 'What does she use to collect samples?', o: ['A hammer', 'A spade', 'A drill', 'Her hands'], a: 0 },
        { q: 'What does she find in the afternoon?', o: ['Gold', 'A fossil of a shell', 'A crystal', 'A cave'], a: 1 },
        { q: 'What will she do tomorrow?', o: ['Go on holiday', 'Send the samples to the laboratory', 'Climb a mountain', 'Buy a new hammer'], a: 1 }
      ]
    },
    {
      id: 'j-caves', lvl: 2, title: 'How Caves Are Formed',
      text: `Most caves in the world are formed in limestone. Limestone is a sedimentary rock made mostly of calcite, a mineral that slowly dissolves in weak acids.

When rain falls, it absorbs a small amount of carbon dioxide from the air and from the soil. This makes the water slightly acidic. The water then flows down through cracks and joints in the rock. Over thousands of years, it dissolves the limestone and makes the cracks wider. Slowly, small channels turn into tunnels, and tunnels turn into large caves.

This type of landscape is called karst. In karst areas, rivers can suddenly disappear underground, and there are often sinkholes – holes in the ground that appear when the roof of a cave collapses.

Inside caves, water drips from the ceiling. As it drips, it leaves behind tiny amounts of calcite. Over time, these form stalactites, which hang from the ceiling, and stalagmites, which grow up from the floor. In Poland, you can see beautiful examples in the caves of the Kraków-Częstochowa Upland and in the Tatra Mountains.`,
      gloss: { dissolves: 'rozpuszcza się', absorbs: 'pochłania', acidic: 'kwaśny', cracks: 'pęknięcia', joints: 'spękania ciosowe', sinkholes: 'leje krasowe, zapadliska', collapses: 'zapada się', drips: 'kapie', stalactites: 'stalaktyty', stalagmites: 'stalagmity', Upland: 'wyżyna' },
      q: [
        { q: 'What mineral is limestone mostly made of?', o: ['Quartz', 'Calcite', 'Mica', 'Feldspar'], a: 1 },
        { q: 'Why is rainwater slightly acidic?', o: ['It contains salt', 'It absorbs carbon dioxide', 'It comes from volcanoes', 'It is polluted by cars'], a: 1 },
        { q: 'What is a sinkhole?', o: ['A type of stalactite', 'A hole that appears when a cave roof collapses', 'An underground river', 'A crack in granite'], a: 1 },
        { q: 'Stalagmites…', o: ['hang from the ceiling', 'grow up from the floor', 'are made of ice', 'are found only in Poland'], a: 1 }
      ]
    },
    {
      id: 'j-groundwater', lvl: 3, title: 'Groundwater Under Pressure',
      text: `Groundwater is one of the most important sources of drinking water in Europe, yet it is often overlooked because it cannot be seen. It is stored in aquifers – layers of permeable rock or sediment, such as sand, gravel or fractured limestone, which can both hold and transmit water.

Aquifers are recharged mainly by precipitation that infiltrates the soil. However, recharge is a slow process. In some regions, water has been pumped out faster than it can be replaced, which has caused the water table to drop by several metres. In coastal areas, over-extraction can also lead to saltwater intrusion, when seawater moves inland and contaminates fresh groundwater.

Another threat is pollution. Nitrates from fertilisers, leaking fuel tanks and poorly managed landfills can all contaminate aquifers. Once groundwater has been polluted, remediation is extremely expensive and may take decades.

For this reason, hydrogeologists carry out regular monitoring. They measure water levels in observation wells, collect samples for chemical analysis, and build numerical models to predict how the aquifer will respond to future demand and climate change. Their findings are used to set sustainable extraction limits and to define protection zones around wells.`,
      gloss: { overlooked: 'pomijany', aquifers: 'warstwy wodonośne', permeable: 'przepuszczalny', gravel: 'żwir', recharged: 'zasilane', precipitation: 'opady', infiltrates: 'przesiąka', 'water table': 'zwierciadło wód podziemnych', 'over-extraction': 'nadmierny pobór', intrusion: 'wdzieranie się', remediation: 'remediacja (oczyszczanie)', wells: 'studnie' },
      q: [
        { q: 'What is an aquifer?', o: ['A type of pump', 'A layer of rock or sediment that holds and transmits water', 'A water treatment plant', 'A deep lake'], a: 1 },
        { q: 'What can happen in coastal areas due to over-extraction?', o: ['Saltwater intrusion', 'Volcanic activity', 'More rainfall', 'Faster recharge'], a: 0 },
        { q: 'According to the text, remediation of polluted groundwater is…', o: ['cheap and fast', 'expensive and slow', 'unnecessary', 'done by farmers'], a: 1 },
        { q: 'Why do hydrogeologists build numerical models?', o: ['To design new pumps', 'To predict how the aquifer will respond to future demand', 'To measure rainfall', 'To produce fertilisers'], a: 1 }
      ]
    },
    {
      id: 'j-dating', lvl: 4, title: 'Reading the Clock in the Rocks',
      text: `How do geologists know that a granite intrusion is 300 million years old? The answer lies in radiometric dating, a technique that exploits the predictable decay of radioactive isotopes.

Certain minerals incorporate radioactive elements when they crystallise. Zircon, for instance, readily accepts uranium into its crystal lattice but strongly rejects lead. Consequently, virtually all the lead found in a zircon crystal today must have been produced by the decay of uranium since the crystal formed. Because the half-life of uranium-238 is about 4.5 billion years, measuring the ratio of parent to daughter isotopes allows the age of the crystal to be calculated with remarkable precision.

Nevertheless, the method is not without caveats. The system must have remained closed: if the mineral was later heated or altered, some daughter isotopes may have escaped, resetting or distorting the "clock". Geologists therefore corroborate their results using several independent methods and carefully examine thin sections under the microscope to identify any alteration.

It is worth emphasising that radiometric dating gives absolute ages, whereas stratigraphy and fossils provide relative ages – they tell us which layer is older, but not by how much. Combining both approaches has enabled scientists to construct the geological time scale that underpins modern Earth science.`,
      gloss: { intrusion: 'intruzja', exploits: 'wykorzystuje', decay: 'rozpad', crystallise: 'krystalizują', lattice: 'sieć krystaliczna', 'half-life': 'okres połowicznego rozpadu', caveats: 'zastrzeżenia', altered: 'przeobrażony', corroborate: 'potwierdzają', 'thin sections': 'płytki cienkie', underpins: 'stanowi podstawę' },
      q: [
        { q: 'Why is zircon useful for dating?', o: ['It contains a lot of lead', 'It accepts uranium but rejects lead when it forms', 'It never crystallises', 'It is radioactive only in water'], a: 1 },
        { q: 'What does "the system must have remained closed" mean?', o: ['The rock was never exposed', 'No isotopes were gained or lost after formation', 'The laboratory was closed', 'The mineral had no cracks'], a: 1 },
        { q: 'How do geologists check their results?', o: ['By guessing', 'By using several independent methods', 'By asking other geologists', 'By heating the samples'], a: 1 },
        { q: 'Stratigraphy and fossils provide…', o: ['absolute ages', 'relative ages', 'isotopic ratios', 'half-lives'], a: 1 }
      ]
    }
  ],
  dominik: [
    {
      id: 'd-looking', lvl: 1, title: 'Looking for a Flat',
      text: `Tom and Kate are looking for a new flat. They have a small baby, so they need two bedrooms. They want to live near a park and a good school.

They call an estate agent, Mr Nowak. He has three flats for them. The first flat is in the city centre. It is bright and modern, but it is very expensive and noisy. The second flat is cheap, but it is on the fifth floor and there is no lift. The third flat is near a park. It has two bedrooms, a big kitchen and a balcony. The rent is 3,000 złoty a month, and bills are not included.

Tom and Kate like the third flat best. They ask Mr Nowak about the parking space and the neighbours. He says there is a parking space under the building and the neighbours are very quiet. They decide to see the flat on Saturday.`,
      gloss: { 'estate agent': 'agent nieruchomości', bright: 'jasny', noisy: 'głośny', lift: 'winda', rent: 'czynsz najmu', bills: 'rachunki, media', included: 'wliczone', 'parking space': 'miejsce parkingowe', neighbours: 'sąsiedzi' },
      q: [
        { q: 'Why do they need two bedrooms?', o: ['They work from home', 'They have a small baby', 'They have a dog', 'They often have guests'], a: 1 },
        { q: 'What is the problem with the second flat?', o: ["It's noisy", "There's no lift", "It's expensive", "It's far from the park"], a: 1 },
        { q: 'Are bills included in the rent of the third flat?', o: ['Yes', 'No', 'Only water', 'Only electricity'], a: 1 },
        { q: 'When will they see the flat?', o: ['On Friday', 'On Saturday', 'Tomorrow', 'Next month'], a: 1 }
      ]
    },
    {
      id: 'd-viewing', lvl: 2, title: 'The First Viewing',
      text: `"Good morning, Mrs Clark. Thanks for coming. Did you find the place easily?" asked Dominik, the estate agent.

"Yes, thank you. The location is really convenient – there's a tram stop just around the corner," she replied.

Dominik showed her the living room first. "As you can see, the living room is spacious and south-facing, so it gets a lot of sunlight in the afternoon. The windows were replaced two years ago." Then they went into the kitchen. "The kitchen is fully fitted – the fridge, oven and dishwasher are included in the price."

Mrs Clark looked around carefully. "What about the heating?" she asked.

"It's connected to the district heating network, so it's quite cheap. The monthly service charge is around 600 złoty, which includes heating and water."

"And how old is the building?"

"It was built in 2008. The homeowners' association is very active – last year they renovated the staircase and installed a new lift."

At the end of the viewing, Mrs Clark said, "I really like it, but I need to discuss it with my husband. Could we arrange a second viewing next week?"

"Of course. I'll send you some dates by email this afternoon," Dominik answered.`,
      gloss: { viewing: 'oglądanie mieszkania', convenient: 'dogodny', spacious: 'przestronny', 'south-facing': 'od strony południowej', 'fully fitted': 'w pełni wyposażona', 'district heating': 'ciepło miejskie (sieciowe)', 'service charge': 'opłata administracyjna (czynsz)', "homeowners' association": 'wspólnota mieszkaniowa', staircase: 'klatka schodowa' },
      q: [
        { q: 'Why does the living room get a lot of sunlight?', o: ['It has a big balcony', 'It is south-facing', 'It has new lamps', "It's on the top floor"], a: 1 },
        { q: 'What is included in the price?', o: ['The living room furniture', 'The fridge, oven and dishwasher', 'A parking space', 'The service charge'], a: 1 },
        { q: 'What does the service charge include?', o: ['Electricity and internet', 'Heating and water', 'Only water', 'Parking'], a: 1 },
        { q: 'What will Dominik do this afternoon?', o: ['Call Mr Clark', 'Send dates for a second viewing', 'Lower the price', 'Repair the lift'], a: 1 }
      ]
    },
    {
      id: 'd-negotiation', lvl: 3, title: 'Negotiating the Price',
      text: `After the second viewing, the Clarks decided to make an offer. The asking price was 780,000 złoty, but their budget was limited and they had noticed that the bathroom needed renovation. They offered 735,000.

The seller, Mr Wiśniewski, was disappointed. He had already turned down a lower offer and felt that his flat was worth the full price. Dominik's job was to find a solution that would satisfy both sides without losing the deal.

First, he gathered evidence. He prepared a short report comparing recent sales of similar flats in the neighbourhood. It showed that comparable properties had sold for between 745,000 and 770,000. He also obtained a rough estimate from a builder: renovating the bathroom would cost about 25,000.

Dominik presented the data to both parties. He pointed out to the seller that the flat had been on the market for over three months and that the buyers were pre-approved for a mortgage, which meant a quick and secure transaction. To the buyers, he emphasised the excellent location and the low service charge.

Eventually, the two sides met halfway. They agreed on 755,000, and the seller agreed to leave the furniture in the living room. A week later they signed a preliminary agreement and the buyers paid a 10% deposit.`,
      gloss: { 'asking price': 'cena wywoławcza', 'turned down': 'odrzucił', worth: 'wart', evidence: 'dowody', comparable: 'porównywalne', 'rough estimate': 'wstępny kosztorys', 'pointed out': 'zwrócił uwagę', 'pre-approved': 'z pozytywną wstępną decyzją kredytową', 'met halfway': 'poszli na kompromis', 'preliminary agreement': 'umowa przedwstępna', deposit: 'zadatek' },
      q: [
        { q: 'Why did the buyers offer less than the asking price?', o: ['The location was bad', 'The bathroom needed renovation and their budget was limited', 'The seller asked them to', 'The flat was too small'], a: 1 },
        { q: "What did Dominik's report compare?", o: ['Mortgage rates', 'Recent sales of similar flats', 'Furniture prices', 'Building costs'], a: 1 },
        { q: 'Why were the buyers attractive to the seller?', o: ['They paid in cash', 'They were pre-approved for a mortgage', 'They were his friends', 'They offered more than the asking price'], a: 1 },
        { q: 'What was the final agreed price?', o: ['735,000', '745,000', '755,000', '780,000'], a: 2 }
      ]
    },
    {
      id: 'd-due-diligence', lvl: 4, title: 'Due Diligence: What Every Buyer Should Check',
      text: `Buying property is, for most people, the largest financial commitment they will ever make. Yet many buyers focus almost exclusively on the condition of the flat and overlook the legal side of the transaction. A competent agent should guide clients through a thorough due diligence process before any binding agreement is signed.

The starting point is the land and mortgage register. It confirms who the legal owner is and reveals any encumbrances – mortgages, easements or claims by third parties. If the property is mortgaged, the agreement must stipulate how and when the seller's debt will be repaid from the purchase price, ideally via an escrow account.

Buyers should also verify the zoning plan for the area. A peaceful view of meadows may be replaced by a motorway or a shopping centre within a few years. For houses and plots, it is advisable to check boundary records and any outstanding building permits or unauthorised extensions.

In apartment buildings, it is worth requesting a certificate from the homeowners' association confirming that there are no arrears in service charges, and reviewing the minutes of recent meetings, which can reveal planned major repairs that will be financed by the owners.

Admittedly, all of this takes time and may incur additional fees. Nevertheless, the cost of due diligence is negligible compared with the potential consequences of buying a property with a defective title.`,
      gloss: { commitment: 'zobowiązanie', overlook: 'pomijają', binding: 'wiążący', 'land and mortgage register': 'księga wieczysta', encumbrances: 'obciążenia', easements: 'służebności', stipulate: 'określać (w umowie)', 'escrow account': 'rachunek powierniczy', 'zoning plan': 'plan zagospodarowania', arrears: 'zaległości', minutes: 'protokoły', incur: 'pociągać za sobą (koszty)', negligible: 'znikomy', 'defective title': 'wadliwy tytuł prawny' },
      q: [
        { q: 'According to the text, what do many buyers overlook?', o: ['The condition of the flat', 'The legal side of the transaction', 'The price', 'The location'], a: 1 },
        { q: 'What does the land and mortgage register reveal?', o: ['The market value', 'The legal owner and any encumbrances', 'The service charge', 'The zoning plan'], a: 1 },
        { q: 'Why should buyers check the zoning plan?', o: ['To find a better view', 'Because future developments may change the area', 'To calculate tax', 'To get a mortgage'], a: 1 },
        { q: "What is the author's conclusion?", o: ['Due diligence is too expensive', 'Due diligence is worth its cost', 'Agents should not get involved', 'Only houses need checking'], a: 1 }
      ]
    }
  ]
};
