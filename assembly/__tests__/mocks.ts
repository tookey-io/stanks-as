const pank = (n: number): string => `https://images.gamma.io/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/${n}.png`;
const ape = (n: number): string => `https://images.gamma.io/ipfs/QmRLFLDWeFsz6e8MVQXB21PX9NByD8mxYnQeCRKmF2LyqX/${n}.png`;
const monster = (n: number): string => ape(n);
const satoshi = (n: number): string => pank(n);
const monkey = (n: number): string => `https://images.gamma.io/ipfs/QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo/${n}.png`;

class MockPlayer {
  name!: string;
  userpic!: string;
}
const playersMock = new Map<number, MockPlayer>();

playersMock.set(1, { name: 'aler.btc', userpic: pank(3) });
playersMock.set(2, { name: 'trevor.btc', userpic: pank(552) });
playersMock.set(3, { name: 'algorithm.btc', userpic: ape(9541) });
playersMock.set(4, { name: 'jackbinswitch.btc', userpic: monster(5555) });
playersMock.set(5, { name: 'monkey.btc', userpic: ape(2311) });
playersMock.set(6, { name: 'elsalvador503.btc', userpic: monkey(133) });
playersMock.set(7, { name: 'thelight.btc', userpic: ape(321) });
playersMock.set(8, { name: 'xan.btc', userpic: satoshi(512) });
playersMock.set(9, { name: 'SP34EBMKMRR6SXX65GRKJ1FHEXV7AGHJ2D8ASQ5M3', userpic: satoshi(231) });
playersMock.set(10, { name: 'johnd.btc', userpic: ape(121) });
playersMock.set(11, { name: 'thedoc.btc', userpic: ape(111) });
playersMock.set(12, { name: '3hunnatheartist.btc', userpic: monster(566) });
playersMock.set(13, { name: 'hero.btc', userpic: ape(1) });
playersMock.set(14, { name: 'nickyspecs.btc', userpic: pank(412) });
playersMock.set(15, { name: 'jim.btc', userpic: pank(512) });
playersMock.set(16, { name: 'griffden.btc', userpic: pank(666) });
playersMock.set(17, { name: 'xenitron.btc', userpic: ape(5) });

export { playersMock };
