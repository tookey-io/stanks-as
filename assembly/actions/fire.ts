import { HEALTH_MIN, POINTS_MIN } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

export function fire(
  game: Game,
  attackerId: PlayerID,
  victimId: PlayerID,
  amount: i32,
): void {
  const attacker = game.players.get(attackerId);
  const victim = game.players.get(victimId);

  const pointsAfter = attacker.points - amount;
  const healthAfter = victim.hearts - amount;

  if (pointsAfter < POINTS_MIN || healthAfter < HEALTH_MIN) {
    return;
  }

  game.addLog(`${attackerId} attacks ${victimId} on ${amount}`);

  game.setPlayerHearts(victimId, healthAfter);
  game.setPlayerPoints(attackerId, pointsAfter);
}
