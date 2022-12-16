import { PLAYERS_MIN, ROUND_DURATION } from './constants';
import { Game, GameConstructor, GameState } from './state';

export function gameInstance(): Game {
  const options: GameConstructor = {
    minPlayers: PLAYERS_MIN,
    roundDuration: ROUND_DURATION,
    roundStartAt: Date.now(),
  };
  return new Game(options);
}

export function gameState(game: Game): GameState {
  return game.state;
}

export function nextRound(game: Game): void {
  game.startNextRound();
}
