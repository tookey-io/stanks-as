import { FIRE_AMOUNT_MIN, HEARTS_MIN, POINTS_MIN } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

export function fire(
  game: Game,
  attackerId: PlayerID,
  victimId: PlayerID,
  amount: i8,
): void {
  const attacker = game.players.get(attackerId);
  const victim = game.players.get(victimId);

  validate(attacker, victim, amount);

  // TODO: range validation
  // The provided fire amount is not within the allowed range

  let fireAmount = amount;
  if (attacker.points < fireAmount) {
    // then use all action points
    fireAmount = attacker.points;
  }

  let heartsAfter = victim.hearts - amount;
  let pointsAfter = attacker.points - fireAmount;

  if (heartsAfter < HEARTS_MIN) heartsAfter = HEARTS_MIN;

  game.addLog(`${attacker.name} attacks ${victim.name} on ${amount}`);

  game.setPlayerHearts(victimId, heartsAfter);

  if (heartsAfter === HEARTS_MIN) {
    game.setPlayerDie(victimId);
    game.addLog(`${victim.name} is killed by ${attacker.name}`);
    if (victim.points > POINTS_MIN) {
      pointsAfter = pointsAfter + victim.points;
      game.addLog(`${attacker.name} received ${victim.points} points`);
    }
  }

  game.setPlayerPoints(attackerId, pointsAfter);
}

function validate(attacker: Player, victim: Player, amount: i8): void {
  if (!attacker) throw new Error('Attacker not found!');
  if (!victim) throw new Error('Victim not found!');
  if (attacker.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (attacker.points <= POINTS_MIN) {
    throw new Error('Insufficient action points for this action');
  }
  if (amount < FIRE_AMOUNT_MIN) {
    throw new Error('The provided fire amount is not valid');
  }
}
