import { Game, GameState } from './state';

export function gameInstance(): Game {
  return new Game();
}

export function gameState(game: Game): GameState {
  return game.state;
}
