import { PLAYERS_MIN } from './constants';
import { Game, GameConstructor, GameState } from './state';

export function gameInstance(): Game {
  const options: GameConstructor = {
    minPlayers: PLAYERS_MIN,
    roundStartAt: Date.now(),
    roundDuration: 3600000, // 1 hour
  };
  return new Game(options);
}

export function gameState(game: Game): GameState {
  return game.state;
}

export function nextRound(game: Game): void {
  game.startNextRound();
}
