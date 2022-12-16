import { HEARTS_START, PLAYERS_MIN, POINTS_START, RANGE_START, ROUND_DURATION } from '../constants';
import { Place, Player } from '../models';
import { Game, GameConstructor } from '../state';
import { playersMock } from './mocks';

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

describe('Game State', () => {
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
      playersMock.get(1).name,
      playersMock.get(1).userpic,
    );
  });

  it('should initialize a new game', () => {
    expect(game.currentRound).toBe(0);
    expect(game.minPlayers).toBe(2);
    expect(game.roundStartAt).toBe(options.roundStartAt);
    expect(game.roundDuration).toBe(options.roundDuration);
    expect(game.players.size).toBe(0);
    expect(game.playersEliminated.size).toBe(0);
    expect(game.log.size).toBe(0);
  });

  it('should add a new player to the game', () => {
    game.addPlayer(player1);

    expect(game.players.get(player1.id)).toBe(player1);
  });

  it('should remove a player from the game', () => {
    game.addPlayer(player1);
    game.removePlayer(player1.id);

    expect(game.players.has(player1.id)).toBeFalsy();
  });

  it('should get the current state of the game', () => {
    game.addPlayer(player1);

    expect(game.state.gameStarted).toBeFalsy();
    expect(game.state.currentRound).toBe(0);
    expect(parseInt(game.state.roundStartAt) as i64).toBeLessThanOrEqual(Date.now());
    expect(parseInt(game.state.timeLeftInRound) as i32).toBeLessThanOrEqual(ROUND_DURATION);
    expect(game.state.players).toContainEqual(player1.toJSON());
    expect(game.state.winner).toBeNull();
    expect(game.state.logs.length).toBe(0);
  });

  it('should reset the game', () => {
    game.addPlayer(player1);
    game.reset();

    expect(game.rounds.size).toBe(0);
    expect(game.winner).toBeNull();
    expect(game.players.size).toBe(0);
    expect(game.playersEliminated.size).toBe(0);
    expect(game.log.size).toBe(0);
  });

  it('should add a log message', () => {
    const game = new Game({
      minPlayers: PLAYERS_MIN,
      roundStartAt: Date.now(),
      roundDuration: ROUND_DURATION,
    });

    game.addLog('This is a log message');

    expect(game.log.size).toBe(1);
    expect(game.log.values().includes('This is a log message')).toBeTruthy();
  });

  it('should start the next round of the game', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    game.startNextRound();

    expect(game.currentRound).toBe(1);
    expect(game.roundStartAt).toBeGreaterThan(Date.now() - ROUND_DURATION);
    expect(game.timeLeftInRound).toBeLessThanOrEqual(ROUND_DURATION);
    expect(game.players.size).toBe(2);
    expect(game.playersEliminated.size).toBe(0);
  });

  it('should set the points of a player', () => {
    game.addPlayer(player1);
    game.setPlayerPoints(player1.id, 3);

    expect(game.players.get(player1.id).points).toBe(3);
  });

  it('should set the "next round" status of a player', () => {
    game.addPlayer(player1);
    expect(game.players.get(player1.id).nextRound).toBeTruthy();

    game.setPlayerRound(player1.id, false);
    expect(game.players.get(player1.id).nextRound).toBeFalsy();

    game.setPlayerRound(player1.id, true);
    expect(game.players.get(player1.id).nextRound).toBeTruthy();
  });

  it('should set the "died" status of a player', () => {
    game.addPlayer(player1);
    game.setPlayerDie(player1.id);

    expect(game.players.get(player1.id).died).toBeTruthy();
  });

  it('should end the game when there is only one player left', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    expect(game.playersCount).toBe(2);
    expect(game.currentRound).toBe(0);

    game.startNextRound();

    expect(game.currentRound).toBe(1);

    game.setPlayerDie(player2.id);
    game.startNextRound();

    expect(game.winner).toBe(player1.id);
  });

  it('should get the list of eliminated players', () => {
    game.addPlayer(player1);
    game.addPlayer(player2);

    game.setPlayerDie(player2.id);

    const eliminatedPlayers = game.jury;
    expect(eliminatedPlayers.has(player1.id)).toBeFalsy();
    expect(eliminatedPlayers.has(player2.id)).toBeTruthy();
  });
});
