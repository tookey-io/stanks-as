import { Place, Player, PlayerID, UnattachedPoint } from './models';
import { Game, GameState } from './state';

export function gameInstance(): Game {
  return new Game();
}

export function gameState(game: Game): GameState {
  return game.state;
}

export function reset(game: Game): void {
  game.reset();
}

export function addLog(game: Game, msg: string): void {
  game.addLog(msg);
}

export function addPlayer(game: Game, player: Player): void {
  game.players.set(player.name, player);
}

export function addTracePath(
  game: Game,
  from: PlayerID,
  to: PlayerID,
  power: i32,
): void {
  game.addTracePath(from, to, power);
}

export function setPlayerHearts(
  game: Game,
  playerId: PlayerID,
  hearts: i32,
): void {
  game.setPlayerHearts(playerId, hearts);
}

export function setPlayerRange(
  game: Game,
  playerId: PlayerID,
  range: i32,
): void {
  game.setPlayerRange(playerId, range);
}

export function addAppearPoint(game: Game, at: Place, height: i32): void {
  game.addAppearPoint(at, height);
}

export function setPlayerPosition(
  game: Game,
  playerId: PlayerID,
  x: i32,
  y: i32,
): void {
  game.setPlayerPosition(playerId, x, y);
}

export function addDissolvePoint(game: Game, at: Place, height: i32): void {
  game.addDissolvePoint(at, height);
}

export function addFloatingPoint(
  game: Game,
  from: UnattachedPoint,
  to: UnattachedPoint,
): void {
  game.addFloatingPoint(from, to);
}

export function setPlayerPoints(
  game: Game,
  playerId: PlayerID,
  points: i32,
): void {
  game.setPlayerPoints(playerId, points);
}
