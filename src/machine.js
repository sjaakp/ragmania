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
import {lexicon} from './lexicon';

function Stap(lading, vanaf, accu)  {
    this.lading = lading;
    this.vanaf = vanaf;
    this.accu = accu;
}

function Machine() {
    // console.log(this);
    console.log(`Ragmania: lexicon geladen, ${lexicon.length} ingangen.`)
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

        for (let i = stap.vanaf; i < lexicon.length; i++) {
            const w = lexicon[i];       // bekijk de volgende ingang in lexicon
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
};

if (typeof WorkerGlobalScope !== 'undefined') {
    // console.log('WorkerGlobalScope', WorkerGlobalScope);
    const machine = new Machine();

    addEventListener('message', m => {
        if (m.data.commando === 'start') {
            machine.minWoordLen = m.data.minKar ?? 3;
            machine.maxWoorden = m.data.maxWoorden ?? 3;
            machine.eerstBreed = m.data.eerstBreed ?? true;
            machine.zoek(m.data.opgave);
        } else {
            // console.log(m.data.commando);
        }
    });
}
