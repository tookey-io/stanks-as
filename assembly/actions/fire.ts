import { HEARTS_MIN, POINTS_MIN } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

const FIRE_AMOUNT_MIN: i8 = 1;

export function fire(
  game: Game,
  attackerId: PlayerID,
  victimId: PlayerID,
  amount: i8,
): void {
  const attacker = game.players.get(attackerId);
  const victim = game.players.get(victimId);

  if (
    !attacker ||
    !victim ||
    amount < FIRE_AMOUNT_MIN ||
    attacker.points <= POINTS_MIN
  ) {
    // bad request
    return;
  }

  if (attacker.nextRound) {
    return;
  }

  let fireAmount = amount;
  if (attacker.points < fireAmount) {
    // then use all action points
    fireAmount = attacker.points;
  }

  let heartsAfter = victim.hearts - amount;
  let pointsAfter = attacker.points - fireAmount;

  if (heartsAfter < HEARTS_MIN) heartsAfter = HEARTS_MIN;

  game.addLog(`${attackerId} attacks ${victimId} on ${amount}`);

  game.setPlayerHearts(victimId, heartsAfter);

  if (heartsAfter === HEARTS_MIN) {
    game.setPlayerDie(victimId);
    if (victim.points > POINTS_MIN) pointsAfter = pointsAfter + victim.points;
  }

  game.setPlayerPoints(attackerId, pointsAfter);
}
