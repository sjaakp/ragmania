Ragmania 2.1
============
### Snelle anagrammenzoeker ###

**Ragmania 2.1** is een JavaScript-module die anagrammen zoekt. Het programma doet dat 
op basis van een idee van Hugo Brandt Corstius (1935-2014). Aan elke letter wordt 
een priemgetal toegekend. Die worden met elkaar vermenigvuldigd. Je kunt dan zien
of een woord in een ander omvat is, door ze te delen. Als er geen rest is, is dat
het geval. In theorie (en volgens mij ook in de praktijk), kun je zo veel sneller
anagrammen vinden dan op basis van lettervergelijking.

Ik maakte **Ragmania 1.0** in 2003, in C++. **Ragmania 2.1** is een compleet nieuwe
schepping. JavaScript is weliswaar trager dan C++, maar kan zonder veel omhaal
vanaf een website worden gebruikt.

**Ragmania 2.1** maakt gebruik van een [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers "MDN"),
zodat de browser responsief blijft, en van grote, zeg maar gerust enorme getallen
([BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt "MDN")).
Om die reden zal **Ragmania 2.1** misschien niet lopen op oudere browsers.

**Ragmania 2.1** wordt gevoed met een woordenlijst: een doodgewoon tekstbestand met 
op iedere regel een woord. In deze repo is dat `nl1.txt`, maar hij kan door andere
worden vervangen, ook in andere talen. Kijk in `index.html` hoe Ragmania moet 
worden aangeroepen.

Meer over de achtergrond van **Ragmania 2.1**, of eigenlijk **Ragmania 1.0** 
[hier](https://sjaakpriester.nl/software/ragmania "sjaakpriester.nl"). Wat daarin staat over 'Haken en ogen',
geldt niet voor **Ragmania 2.1**, dankzij de _BigInt_.

Werkend is **Ragmania 2.1** [hier](https://ptht.nl/ragmania "PTHT") te bewonderen.

**Saprijke Sater**

27 april 2025
