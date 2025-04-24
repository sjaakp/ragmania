Ragmania 2.0
============
### Snelle anagrammenzoeker ###

**Ragmania 2.0** is een JavaScript-module die anagrammen zoekt. Het programma doet dat 
op basis van een idee van Hugo Brandt Corstius (1935-2014). Aan elke letter wordt 
een priemgetal toegekend. Die worden met elkaar vermenigvuldigd. Je kunt dan zien
of een woord in een ander omvat is, door ze te delen. Als er geen rest is, is dat
het geval. In theorie (en volgens mij ook in de praktijk), kun je zo veel sneller
anagrammen vinden dan op basis van lettervergelijking.

Ik maakte **Ragmania 1.0** in 2003, in C++. **Ragmania 2.0** is een compleet nieuwe
schepping. JavaScript is weliswaar trager dan C++, maar kan zonder veel omhaal
vanaf een website worden gebruikt.

**Ragmania 2.0** maakt gebruik van een [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers "MDN"),
zodat de browser responsief blijft, en van groite, zeg maar gerust enorme getallen
([BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt "MDN")).
Om die reden zal **Ragmania 2.0** misschien niet lopen op oudere browsers.

Het _lexicon_ van **Ragmania 2.0** is een _plain JavaScript Object_ waarin de tekst
en hetg corresponderende product van priemgetallen zijn samengebracht, 
aflopend gesorteerd naar de grootte van dat product. **Lexigraaf** is 
een tooltje om van een woordenlijst zo'n _lexicon_ te maken. 

Meer over de achtergrond van **Ragmania 2.0**, of eigenlijk **Ragmania 1.0** 
[hier](https://sjaakpriester.nl/software/ragmania "sjaakpriester.nl"). Wat daarin staat over 'Haken en ogen',
geldt niet voor **Ragmania 2.0**, dankzij de _BigInt_.

Werkend is **Ragmania 2.0** [hier](https://ptht.nl/ragmania "PTHT") te bewonderen.

**Saprijke Sater**

24 april 2025
