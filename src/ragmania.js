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

function Ragmania() {
    if (!window.Worker) {
        console.error('Ragmania: deze browser ondersteunt geen Worker-threads.');
        return;
    }
    if (!window.BigInt) {
        console.error('Ragmania: deze browser ondersteunt geen BigInt.');
        return;
    }

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
        this.worker.terminate();
        this.meldStop('Afgebroken');
        this.zetZoekend(false);
        this.worker = this.maakMachine();
    });

    this.opgave.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            this.run();
            e.preventDefault();
        }
    });

    this.worker = this.maakMachine();
    this.zetZoekend(false);
    // console.log(this);
}

Ragmania.prototype = {
    maakMachine()   {
        const worker = new Worker(new URL('machine.js', import.meta.url), { type: 'module' });
        worker.addEventListener('message', e => {
            switch (e.data.commando)    {
                case 'vondst':
                    this.teller++;
                    this.result.innerHTML += `<p>${e.data.tekst}</p>`;
                    this.bericht.textContent = this.teller;
                    break;
                case 'gereed':
                    this.meldStop('Gereed');
                    this.zetZoekend(false);
                    break;
                case 'tik':
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

new Ragmania();
