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

export default function Ragmania(lexUrl) {
    if (!window.Worker) {
        console.error('Ragmania: deze browser ondersteunt geen Worker-threads.');
        return;
    }
    if (!window.BigInt) {
        console.error('Ragmania: deze browser ondersteunt geen BigInt.');
        return;
    }
    this.lexUrl = lexUrl;

    this.container = document.getElementById('rag-container');
    this.opgave = document.getElementById('rag-opgave');
    this.minKar = document.getElementById('rag-minkar');
    this.maxWoord = document.getElementById('rag-maxwoord');
    this.start = document.getElementById('rag-start');
    this.stop = document.getElementById('rag-stop');
    this.tik = document.getElementById('rag-tik');
    this.result = document.getElementById('rag-result');
    this.bericht = document.getElementById('rag-bericht');

    this.teller = 0;

    this.start.addEventListener('click', e => {
        this.run();
    });

    this.stop.addEventListener('click', e => {
/*
        this.worker.postMessage({   // dit werkt nog niet
            commando: 'stop',
        });
*/
        this.worker.terminate();        // paardenmiddel: kill de worker...
        this.meldStop('Afgebroken');
        this.zetZoekend(false);
        this.start.disabled = true;
        this.worker = this.maakMachine(this.lexUrl);    // ... en herbouw de worker
    });

    this.opgave.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            this.run();
            e.preventDefault();
        }
    });

    this.zetZoekend(false);
    this.start.disabled = true;
    this.worker = this.maakMachine(lexUrl);
    // console.log(this);
}

Ragmania.prototype = {
    maakMachine(lexUrl)   {    // maak de worker
        const url = new URL('machine.js', import.meta.url);
        url.searchParams.set('lexicon', lexUrl)

        const worker = new Worker(url, { type: 'module' });
        worker.addEventListener('message', e => {
            switch (e.data.commando)    {
                case 'paraat':
                    this.start.disabled = false;
                    console.log(`Lexicon geladen, bron: ${e.data.url}, ${e.data.woorden} woorden.`)
                    break;
                case 'vondst':      // anagram gevonden, verhoog teller en vertoon
                    this.teller++;
                    this.result.innerHTML += `<p>${e.data.tekst}</p>`;
                    this.bericht.textContent = this.teller;
                    break;
                case 'gereed':
                    this.meldStop('Gereed');
                    this.zetZoekend(false);
                    break;
                case 'tik':     // laat zien dat zoekproces nog gaande is
                    let m = (e.data.nr / 40) % 40;
                    if (m > 20) m = 40 - m;
                    this.tik.value = m;
                    break;
            }
        });
        return worker;
    },

    run() {
        this.zetZoekend(true);
        this.tStart = performance.now();
        this.worker.postMessage({
            commando: 'start',
            minKar: this.minKar.value,
            maxWoorden: this.maxWoord.value,
            opgave: this.opgave.value
        });
    },

    zetZoekend(z) {
        if (z) {
            this.teller = 0;
            this.result.innerHTML = '';
            this.bericht.innerHTML = '&nbsp;';
            this.container.classList.add('zoekend');
            this.start.disabled = true;
            this.stop.disabled = false;
            this.tik.value = 0;

        } else {
            this.container.classList.remove('zoekend');
            this.start.disabled = false;
            this.stop.disabled = true;
            this.tik.value = 0;
        }
    },

    meldStop(reden) {
        this.bericht.textContent = `${reden}. ${this.teller} anagrammen gevonden in ${((performance.now() - this.tStart).toFixed(2))} ms.`;
    }
};
