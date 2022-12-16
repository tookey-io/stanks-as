import { share } from '../../actions';
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

describe('Action: Share', () => {
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

  it('should throw an error if the sender is not found', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      share(game, player3.id, player2.id, 1);
    }).toThrow('Sender not found!');
  });

  it('should throw an error if the receiver is not found', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      share(game, player1.id, player3.id, 1);
    }).toThrow('Receiver not found!');
  });

  it('should throw an error if the sender has confirmed the next round', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      share(game, player1.id, player2.id, 1);
    }).toThrow('Cannot take action until the next round begins');
  });

  it('should throw an error if the share amount is not valid', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      share(game, player1.id, player2.id, 0);
    }).toThrow('The provided share amount is not valid');
  });

  it('should throw an error if the sender has insufficient action points', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      share(game, player1.id, player2.id, 10);
    }).toThrow('Insufficient action points for this action');
  });

  it('should throw an error if the sender is out of range', () => {
    game.addPlayer(player1);
    game.addPlayer(player3);
    game.startNextRound();

    expect(() => {
      share(game, player1.id, player3.id, 1);
    }).toThrow('The provided share amount is not within the range');
  });

  it("should increase the receiver's points by the share amount", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    share(game, player1.id, player2.id, 1);

    expect(game.players.get(player2.id).points).toBe(2);
  });

  it("should reduce the sender's points by the share amount", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    share(game, player1.id, player2.id, 1);

    expect(game.players.get(player1.id).points).toBe(0);
  });

  it('should add a log entry for the share', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    share(game, player1.id, player2.id, 1);

    expect(game.log.values()).toContain(`${player1.name} shares 1 to ${player2.name}`);
  });
});
