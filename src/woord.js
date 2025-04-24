

export default function Woord(t) {
    this.t = t ?? '';               // tekst; indien null: lege tekst
    const letters = this.t.normalize('NFD')  // verander accentletters in dubbele tekens
        .replace(/[^\w]|\d|_/g, "")   // verwijder alles wat niet alfanumeriek is (dus ook spaties), '_' en alle cijfers
        .toLowerCase()              // naar onderkast
        .split('');        // naar Array van letters

    this.l = letters.reduce((acc, letter) => acc * this.factoren[letter], 1n);   // lading
}

Woord.prototype = {

    // priemfactoren per letter, als BigInt
    // hoe zeldzamer de letter, hoe hoger de priemfactor
    factoren: {
        a: 5n,
        b: 73n,
        c: 67n,
        d: 17n,
        e: 2n,
        f: 83n,
        g: 31n,
        h: 37n,
        i: 7n,
        j: 59n,
        k: 47n,
        l: 29n,
        m: 43n,
        n: 3n,
        o: 19n,
        p: 71n,
        q: 101n,
        r: 13n,
        s: 23n,
        t: 11n,
        u: 53n,
        v: 41n,
        w: 61n,
        x: 97n,
        y: 89n,
        z: 79n
    },

    // Kijk of dit woord in lading zit
    // Parameter: BigInt
    // return: false (past niet) of BigInt (lading overgebleven letters)
    zitIn(lading)   {
        if (this.l > lading) return false;          // onze l is groter dan lading
        if (lading % this.l !== 0n) return false;   // onze l deelt niet perfect
        return lading / this.l;                     // return restant van lading
    },

    // Vergelijkingsfunctie voor sort, moet Number geven, dus geen BigInt
    vergelijk(anderWoord) {
        return Number(anderWoord.l - this.l);
    },

    // Tekst output voor definitie (JS-compatibel)
    output()    {
        return `{t:"${this.t}",l:${this.l}n}`;
    }

};
