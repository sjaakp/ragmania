/**
 * sjaakp/ragmania
 * ---------------
 *
 * Snelle anagrammenzoeker op basis van een idee van Hugo Brandt Corstius
 * Versie 2.1.0
 * Copyright (c) 2025
 * Sjaak Priester, Amsterdam
 * MIT License
 * https://github.com/sjaakp/ragmania
 * https://sjaakpriester.nl
 */

import Woord from './woord.js';

function Stap(lading, vanaf, accu)  {
    this.lading = lading;
    this.vanaf = vanaf;
    this.accu = accu;
}

function Machine(lexUrl) {
    this.laadLexicon(lexUrl)
}

Machine.prototype = {
    minWoordLen: 3,
    maxWoorden: 3,
    eerstBreed: true,

    zoek(tekst) {
        this.opgave = tekst;
        this.tikTeller = 0;
        const woord = new Woord(tekst);
        this.stappen = [ new Stap(woord.l, 0, []) ];  // vul stack met allereerste stap, accu leeg
        while (this.stappen.length)   {
            this.zoekStap(this.eerstBreed ? this.stappen.pop() : this.stappen.shift());
        }
        postMessage({ commando: 'gereed' });
    },

    zoekStap(stap) {
        this.tikTeller++;
        if ((this.tikTeller % 40) === 0) {
            postMessage({ commando: 'tik', nr: this.tikTeller });
        }
        let accu = stap.accu.slice();   // maak een ondiepe kopie van accu

        for (let i = stap.vanaf; i < this.lexicon.length; i++) {
            const w = this.lexicon[i];       // bekijk de volgende ingang in lexicon
            if (w.t.length < this.minWoordLen) continue;    // ingang is te kort, skip

            const rest = this.bevat(w.l, stap.lading);      // zit ingang in opgave?
            if (rest !== false) {       // passende ingang gevonden
                this.stappen.push(new Stap(stap.lading, i + 1, stap.accu));   // registreer stap om verder te zoeken
                if (accu.length < this.maxWoorden) {    // skip als al genoeg ingangen
                    accu.push(w.t);         // bewaar ingang in accu
                    if (rest === 1n) {      // gehele lading opgebruikt
                        const vondst = accu.join(' ');
                        if (vondst !== this.opgave) postMessage({ commando: 'vondst', tekst: vondst });    // meld resultaat
                    }
                    else {      // nog meer te zoeken
                        this.stappen.push(new Stap(rest, i, accu));   // zoek verder met de rest
                    }
                }
                return; // we zijn klaar met deze stap
            }
        }
    },

    bevat(speld, hooiberg) {
        if (speld > hooiberg) return false;
        if (hooiberg % speld !== 0n) return false;   // deelt niet perfect
        return hooiberg / speld;                     // return restant van lading
    },

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#processing_a_text_file_line_by_line
    async * makeIterator(url) {
        const response = await fetch(url);
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let { value: chunk, done: readerDone } = await reader.read();
        chunk = chunk || "";

        const newline = /\r?\n/gm;
        let startIndex = 0;

        while (true) {
            const result = newline.exec(chunk);
            if (!result) {
                if (readerDone) break;
                const remainder = chunk.substring(startIndex);  // (voorbeeld had substr, deprecated)
                ({ value: chunk, done: readerDone } = await reader.read());
                chunk = remainder + (chunk || "");
                startIndex = newline.lastIndex = 0;
                continue;
            }
            yield chunk.substring(startIndex, result.index);
            startIndex = newline.lastIndex;
        }

        if (startIndex < chunk.length) {
            // Last line didn't end in a newline char
            yield chunk.substring(startIndex);
        }
    },

    async laadLexicon(url) {
        this.lexicon = [];      // verwijder eventueel oud lexicon

        const wset = new Set();
        for await (const regel of this.makeIterator(url))    {
            wset.add(regel.trim());     // verzamel in Set om alleen unieke regels over te houden
        }
        this.lexicon = wset.values()
            .map(rgl => new Woord(rgl))     // maak Woord van regel
            .filter(w => w.l !== 1n)    // verwijder Woorden zonder letters (leeg, of alleen cijfers en leestekens
            .toArray().sort((a, b) => a.vergelijk(b));  // sorteer op afnemende lading

        console.log(this);
        postMessage({ commando: 'paraat', woorden: this.lexicon.length, url: url });
    }
};

if (typeof WorkerGlobalScope !== 'undefined') {
    const url = new URL(self.location);
    const lexUrl = url.searchParams.get('lexicon');
    const machine = new Machine(lexUrl);

    addEventListener('message', m => {
        switch (m.data.commando)    {
            case 'start':
                machine.minWoordLen = m.data.minKar ?? 3;
                machine.maxWoorden = m.data.maxWoorden ?? 3;
                machine.eerstBreed = m.data.eerstBreed ?? true;
                machine.zoek(m.data.opgave);
                break;
            case 'stop':
                // TODO: betere manier om te stoppen i.p.v. terminate
                break;
            case 'lexicon':
                machine.laadLexicon(m.data.lexicon);
                break;
        }
    });
}
