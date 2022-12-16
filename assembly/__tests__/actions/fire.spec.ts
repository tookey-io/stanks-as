import { fire } from '../../actions';
import { HEARTS_MIN, HEARTS_START, POINTS_START, RANGE_START, ROUND_DURATION } from '../../constants';
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

describe('Action: Fire', () => {
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

  it('should throw an error if the attacker is not found', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    expect(() => {
      fire(game, player3.id, player2.id, 1);
    }).toThrow('Player not found!');
  });

  it('should throw an error if the victim is not found', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      fire(game, player1.id, player3.id, 1);
    }).toThrow('Player not found!');
  });

  it('should throw an error if the attacker has confirmed the next round', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(() => {
      fire(game, player1.id, player2.id, 1);
    }).toThrow('Cannot take action until the next round begins');
  });

  it('should throw an error if the fire amount is not valid', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      fire(game, player1.id, player2.id, 0);
    }).toThrow('The provided fire amount is not valid');
  });

  it('should throw an error if the attacker has insufficient action points', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    expect(() => {
      fire(game, player1.id, player2.id, 10);
    }).toThrow('Insufficient action points for this action');
  });

  it('should throw an error if the attacker is out of range', () => {
    game.addPlayer(player1);
    game.addPlayer(player3);
    game.startNextRound();

    expect(() => {
      fire(game, player1.id, player2.id, 5);
    }).toThrow('The provided fire amount is not within the range');
  });

  it("should reduce the victim's hearts by the fire amount", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    fire(game, player1.id, player2.id, 1);

    expect(game.getPlayer(player2.id).hearts).toBe(2);
  });

  it("should reduce the attacker's points by the fire amount", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    fire(game, player1.id, player2.id, 1);

    expect(game.getPlayer(player1.id).points).toBe(0);
  });

  it("should set the victim's hearts to the minimum value if it is below the minimum", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();
    game.setPlayerPoints(player1.id, 5);

    fire(game, player1.id, player2.id, 5);

    expect(game.getPlayer(player2.id).hearts).toBe(HEARTS_MIN);
  });

  it('should set the victim as dead if their hearts reach the minimum', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();
    game.setPlayerPoints(player1.id, 5);

    fire(game, player1.id, player2.id, 5);

    expect(game.getPlayer(player2.id).died).toBe(true);
  });

  it("should add the victim's points to the attacker's points if the victim has points above the minimum when they die", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 4);
    game.setPlayerPoints(player2.id, 5);

    fire(game, player1.id, player2.id, 3);

    expect(game.getPlayer(player1.id).points).toBe(6);
  });

  it("should not add the victim's points to the attacker's points if the victim has no points above the minimum when they die", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 3);
    game.setPlayerPoints(player2.id, 0);

    fire(game, player1.id, player2.id, 3);

    expect(game.getPlayer(player1.id).points).toBe(0);
  });

  it('should add a log entry for the attack', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    fire(game, player1.id, player2.id, 1);

    expect(game.getLog()).toContain(`${player1.name} attacks ${player2.name} on 1`);
  });

  it("should add a log entry for the victim's death", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 3);

    fire(game, player1.id, player2.id, 3);

    expect(game.getLog()).toContain(`${player2.name} is killed by ${player1.name}`);
  });

  it("should add a log entry for the attacker receiving points from the victim's death", () => {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startNextRound();

    game.setPlayerPoints(player1.id, 3);
    game.setPlayerPoints(player2.id, 5);

    fire(game, player1.id, player2.id, 3);

    expect(game.getLog()).toContain(`${player1.name} received 5 points`);
  });
});
