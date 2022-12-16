import { move } from '../../actions';
import { HEARTS_START, POINTS_START, RANGE_START, ROUND_DURATION } from '../../constants';
import { Place, Player } from '../../models';
import { Game, GameConstructor } from '../../state';
import { playersMock } from '../mocks';

const options: GameConstructor = {
  minPlayers: 2,
  roundStartAt: Date.now(),
  roundDuration: ROUND_DURATION,
};

let game = new Game(options);

let player1 = new Player(
  new Place(0, 1),
  POINTS_START,
  HEARTS_START,
  RANGE_START,
  playersMock.get(1).name,
  playersMock.get(1).userpic,
);

let player2 = new Player(
  new Place(0, 2),
  POINTS_START,
  HEARTS_START,
  RANGE_START,
  playersMock.get(2).name,
  playersMock.get(2).userpic,
);

let player3 = new Player(
  new Place(10, 10),
  POINTS_START,
  HEARTS_START,
  RANGE_START,
  playersMock.get(3).name,
  playersMock.get(3).userpic,
);

describe('Action: Move', () => {
  beforeEach(() => {
    game = new Game(options);
    player1 = new Player(
      new Place(0, 1),
      POINTS_START,
      HEARTS_START,
      RANGE_START,
      playersMock.get(1).name,
      playersMock.get(1).userpic,
    );
    player2 = new Player(
      new Place(0, 2),
      POINTS_START,
      HEARTS_START,
      RANGE_START,
      playersMock.get(2).name,
      playersMock.get(2).userpic,
    );
    player3 = new Player(
      new Place(10, 10),
      POINTS_START,
      HEARTS_START,
      RANGE_START,
      playersMock.get(3).name,
      playersMock.get(3).userpic,
    );
  });

  it('should throw an error if the player is not found', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      move(game, player3.id, 1, 2);
    }).toThrow('Player not found!');
  });

  it('should throw an error if the player has not confirmed their move for the next round', () => {
    game.addPlayer(player1);

    expect(() => {
      move(game, player1.id, 1, 2);
    }).toThrow('Cannot take action until the next round begins');
  });

  it('should throw an error if the player has insufficient action points for this action', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      move(game, player1.id, 10, 2);
    }).toThrow('Insufficient action points for this action');
  });

  it('should update the player position and points correctly', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    move(game, player1.id, 1, 2);

    expect(game.players.get(player1.id).position).toStrictEqual(new Place(1, 2));
    expect(game.players.get(player1.id).points).toBe(0);
  });

  it('should throw an error if the destination position is occupied', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      move(game, player1.id, 0, 2);
    }).toThrow('This position is unavailable for movement');
  });
});
