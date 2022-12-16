import { fire, share, spawn } from '../actions';
import { Game, GameConstructor } from '../state';
import { playersMock } from './mocks';

describe('Game scenarios', () => {
  test('Game 1: Player1 win', () => {
    const options: GameConstructor = {
      minPlayers: 2,
      roundStartAt: Date.now(),
      roundDuration: 1000,
    };
    const game = new Game(options);

    expect(game.minPlayers).toBe(options.minPlayers);
    expect(game.roundStartAt).toBe(options.roundStartAt);
    expect(game.roundDuration).toBe(options.roundDuration);
    expect(game.players.size).toBe(0);
    expect(game.playersEliminated.size).toBe(0);
    expect(game.log.size).toBe(0);
    expect(game.currentRound).toBe(0);

    for (let i: i8 = 0; i < options.minPlayers; i++) {
      const player = playersMock.get(i + 1);
      spawn(game, i, i, player.name, player.userpic);
    }

    expect(game.playersCount).toBe(2, '0 -> 2');

    const playerIds = game.players.keys();
    const player1 = game.players.get(playerIds[0]);
    const player2 = game.players.get(playerIds[1]);

    expect(player1.nextRound).toBe(true);
    expect(player1.points).toBe(0);
    expect(player1.hearts).toBe(3);
    expect(player1.died).toBe(false);

    expect(player2.nextRound).toBe(true);
    expect(player2.points).toBe(0);
    expect(player2.hearts).toBe(3);
    expect(player2.died).toBe(false);

    //
    // ROUND 1
    //

    game.startNextRound();

    expect(game.currentRound).toBe(1, '0 -> 1');

    expect(player1.nextRound).toBe(false, 'true -> false');
    expect(player1.points).toBe(1, '0 -> 1');
    expect(player1.hearts).toBe(3, '=');
    expect(player1.died).toBe(false, '=');
    expect(player2.nextRound).toBe(false, 'true -> false');
    expect(player2.points).toBe(1, '0 -> 1');
    expect(player2.hearts).toBe(3, '=');
    expect(player2.died).toBe(false, '=');

    share(game, player2.id, player1.id, 1);

    expect(player1.points).toBe(2, '1 -> 2');
    expect(player2.points).toBe(0, '1 -> 0');
    expect(player2.nextRound).toBe(true, 'false -> true');

    fire(game, player1.id, player2.id, 2);

    expect(player1.points).toBe(0, '2 -> 0');
    expect(player1.nextRound).toBe(true, 'false -> true');
    expect(player2.hearts).toBe(1, '3 -> 1');

    //
    // ROUND 2
    //

    game.startNextRound();

    expect(game.currentRound).toBe(2, '1 -> 2');
    expect(game.playersCount).toBe(2, '=');

    expect(player1.nextRound).toBe(false, 'true -> false');
    expect(player1.points).toBe(1, '0 -> 1');
    expect(player1.hearts).toBe(3, '=');
    expect(player1.died).toBe(false, '=');

    expect(player2.nextRound).toBe(false, 'true -> false');
    expect(player2.points).toBe(1, '0 -> 1');
    expect(player2.hearts).toBe(1, '=');
    expect(player2.died).toBe(false, '=');

    fire(game, player1.id, player2.id, 1);

    expect(player2.died).toBe(true, 'false -> true');
    expect(player2.points).toBe(0, '1 -> 0');
    expect(player1.points).toBe(player2.points, '0 -> player2.points');

    expect(game.playersCount).toBe(1, '2 -> 1');
    expect(game.playersEliminated.size).toBe(1, '0 -> 1');
    expect(game.playersEliminated.values()).toContain(player2.id);

    expect(game.winner).toBe(null, 'Will be set after call startNextRound()');

    //
    // FINAL
    //

    game.startNextRound();
    expect(game.currentRound).toBe(2, 'Has not changed');

    expect(game.winner).toBe(player1.id);
    expect(game.log.values()).toContain(`The winner is ${player1.name}`);
  });
});
