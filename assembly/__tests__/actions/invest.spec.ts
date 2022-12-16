import { invest } from '../../actions';
import { HEARTS_START, POINTS_START, RANGE_MAX, RANGE_START, ROUND_DURATION } from '../../constants';
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

describe('Action: Invest', () => {
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
      invest(game, player3.id, 1);
    }).toThrow('Player not found!');
  });

  it('should throw an error if the player has not confirmed their move for the next round', () => {
    game.addPlayer(player1);

    expect(() => {
      invest(game, player1.id, 10);
    }).toThrow('Cannot take action until the next round begins');
  });

  it('should throw an error if the provided invest amount is not valid', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      invest(game, player1.id, 0);
    }).toThrow('The provided invest amount is not valid');
  });

  it('should throw an error if the player has insufficient action points for this action', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      invest(game, player1.id, 10);
    }).toThrow('Insufficient action points for this action');
  });

  it("should increase the player's range by the provided amount and decrease the player's points by the same amount", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 5);

    invest(game, player1.id, 3);

    expect(game.getPlayer(player1.id).range).toBe(5);
    expect(game.getPlayer(player1.id).points).toBe(2);
  });

  it('should set the range to the maximum allowed value and reduce the invest amount if the updated range exceeds the maximum allowed value', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 10);

    invest(game, player1.id, 10);

    expect(game.getPlayer(player1.id).range).toBe(RANGE_MAX);
    expect(game.getPlayer(player1.id).points).toBe(7);
  });

  it('should log the action', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 5);

    invest(game, player1.id, 3);

    expect(game.getLog()).toContain(`${player1.name} increases range on 3`);
  });
});
