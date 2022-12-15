import { POINTS_MIN, RANGE_MAX } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

export function invest(game: Game, whoId: PlayerID, amount: i32): void {
  const player = game.players.get(whoId);

  const rangeAfter = player.range + amount;
  const pointsAfter = player.points - amount;

  if (rangeAfter > RANGE_MAX || pointsAfter < POINTS_MIN) {
    return;
  }

  game.addLog(`${whoId} increases range on ${amount}`);

  game.setPlayerRange(whoId, rangeAfter);
  game.setPlayerPoints(whoId, pointsAfter);
}
