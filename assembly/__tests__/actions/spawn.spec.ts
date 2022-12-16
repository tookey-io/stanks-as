import { spawn } from '../../actions';
import { HEARTS_START, POINTS_START, RANGE_START, ROUND_DURATION } from '../../constants';
import { PlayerJSON } from '../../models';
import { Game, GameConstructor } from '../../state';
import { playersMock } from '../mocks';

const options: GameConstructor = {
  minPlayers: 2,
  roundStartAt: Date.now(),
  roundDuration: ROUND_DURATION,
};

let game = new Game(options);
const x: i8 = -1;
const y: i8 = 0;
const name = playersMock.get(1).name;
const userpic = playersMock.get(1).userpic;

describe('Action: Spawn', () => {
  beforeEach(() => {
    game = new Game(options);
  });

  it('should add a new player to the game', () => {
    const player = spawn(game, x, y, name, userpic);

    expect(game.playersCount).toBe(1);
    expect(player).toStrictEqual({
      id: player.id,
      position: [x, y],
      points: POINTS_START,
      hearts: HEARTS_START,
      range: RANGE_START,
      name,
      userpic,
      nextRound: true,
      died: false,
    } as PlayerJSON);
  });

  it('should log the event of spawning a new player', () => {
    spawn(game, x, y, name, userpic);

    expect(game.log.values()).toContain(`Spawn ${name}`);
  });
});
