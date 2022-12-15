import assert from 'assert';

import {
  gameInstance,
  gameState,
  nextRound,
  spawn,
  fire,
  share,
  move,
  invest,
} from '../build/debug.js';

const game = gameInstance();

assert.strictEqual(gameState(game).gameStarted, false);
assert.strictEqual(gameState(game).currentRound, 0);
assert.throws(
  () => {
    nextRound(game);
  },
  {
    message: /Waiting for more players to join/,
  },
);

const userpic = {
  pank: (n) =>
    `https://images.gamma.io/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/${n}.png`,
  ape: (n) =>
    `https://images.gamma.io/ipfs/QmRLFLDWeFsz6e8MVQXB21PX9NByD8mxYnQeCRKmF2LyqX/${n}.png`,
  monster: (n) => userpic.ape(n),
  satoshi: (n) => userpic.pank(n),
  monkey: (n) =>
    `https://images.gamma.io/ipfs/QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo/${n}.png`,
};

const ALER = 'aler.btc';
const TREVOR = 'trevor.btc';
const ALGO = 'algorithm.btc';
const JACK = 'jackbinswitch.btc';
const MONKEY = 'monkey.btc';
const ELSA = 'elsalvador503.btc';
const LIGHT = 'thelight.btc';
const XAN = 'xan.btc';
const UNKNOWN = 'SP34EBMKMRR6SXX65GRKJ1FHEXV7AGHJ2D8ASQ5M3';
const JOHND = 'johnd.btc';
const DOC = 'thedoc.btc';
const ART = '3hunnatheartist.btc';
const HERO = 'hero.btc';
const NICKY = 'nickyspecs.btc';
const JIM = 'jim.btc';
const GRIF = 'griffden.btc';
const XEN = 'xenitron.btc';

const aler = spawn(game, 3, 5, ALER, userpic.pank(3));
const trevor = spawn(game, 17, 8, TREVOR, userpic.pank(552));
const algo = spawn(game, 15, 7, ALGO, userpic.ape(9541));
const jack = spawn(game, 10, 5, JACK, userpic.monster(5555));
const monkey = spawn(game, 11, 6, MONKEY, userpic.ape(2311));
const elsa = spawn(game, 4, 9, ELSA, userpic.monkey(133));
const light = spawn(game, 6, 4, LIGHT, userpic.ape(321));
const xan = spawn(game, 8, 9, XAN, userpic.satoshi(512));
const unknown = spawn(game, 16, 2, UNKNOWN, userpic.satoshi(231));
const johnd = spawn(game, 5, 1, JOHND, userpic.ape(121));
const doc = spawn(game, 11, 2, DOC, userpic.ape(111));
const art = spawn(game, 14, 5, ART, userpic.monster(566));
const hero = spawn(game, 0, 1, HERO, userpic.ape(1));
const nicky = spawn(game, 18, 1, NICKY, userpic.pank(412));
const jim = spawn(game, 2, 9, JIM, userpic.pank(512));
const grif = spawn(game, 1, 3, GRIF, userpic.pank(666));
const xen = spawn(game, 3, 3, XEN, userpic.ape(5));

nextRound(game);

move(game, light.id, 5, 3);
fire(game, elsa.id, jim.id, 1);
fire(game, jim.id, elsa.id, 1);
share(game, trevor.id, algo.id, 1);
share(game, hero.id, grif.id, 1);
share(game, grif.id, xen.id, 2);
share(game, aler.id, xen.id, 1);
share(game, johnd.id, xen.id, 1);
share(game, algo.id, art.id, 2);
share(game, monkey.id, jack.id, 1);
// move(game, light.id, 0, 1);
share(game, unknown.id, nicky.id, 1);
// move(game, nicky.id, 1, -1);
invest(game, nicky.id, 1);
invest(game, art.id, 1);
fire(game, art.id, monkey.id, 1);
// move(game, art.id, 1, 1);
invest(game, jack.id, 1);
fire(game, jack.id, doc.id, 1);
// move(game, doc.id, 1, 1);
invest(game, xan.id, 1);
fire(game, xen.id, johnd.id, 3);
invest(game, xen.id, 1);
fire(game, xen.id, light.id, 1);

console.log(gameState(game));

const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

console.log(gameState(game).timeLeftInRound);
await sleep(1234);

console.log(gameState(game).timeLeftInRound);

console.log('ok');
