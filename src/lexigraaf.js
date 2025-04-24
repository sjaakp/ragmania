/**
 * sjaakp/ragmania
 * ---------------
 *
 * Snelle anagrammenzoeker op basis van een idee van Hugo Brandt Corstius
 * Versie 2.0.0
 * Copyright (c) 2025
 * Sjaak Priester, Amsterdam
 * MIT License
 * https://github.com/sjaakp/ragmania
 * https://sjaakpriester.nl
 */

import Woord from './woord';

function lijstNaarLexicon(lijst)    {
    // splits in Array, verwijder lege regels
    const woordSet = new Set(lijst.split('\n').filter(w => w.length));     // plaats in Set, houd alleen unieke woorden
    const lexicon = woordSet.values().map(w => new Woord(w)).toArray().sort((a, b) => a.vergelijk(b));
    const lexSrc = lexicon.map(w => w.output());
    return `export const lexicon=[\n${lexSrc.join(',\n')}\n];\n`;
}

document.getElementById('start').addEventListener('click', (event) => {
    const bericht = document.getElementById('bericht');
    bericht.innerHTML = '&nbsp;';
    navigator.clipboard.writeText(lijstNaarLexicon(document.getElementById('woorden').value));
    bericht.innerHTML = 'Lexicon naar kladblok gekopieerd';
});

