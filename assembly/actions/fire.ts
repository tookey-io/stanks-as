import { FIRE_AMOUNT_MIN, HEARTS_MIN, POINTS_MIN } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

export function fire(
  game: Game,
  attackerId: PlayerID,
  victimId: PlayerID,
  amount: i8,
): void {
  if (!game.players.has(attackerId)) throw new Error('Attacker not found!');
  if (!game.players.has(victimId)) throw new Error('Victim not found!');

  const attacker = game.players.get(attackerId);
  const victim = game.players.get(victimId);

  validate(attacker, victim, amount);

  let heartsAfter = victim.hearts - amount;
  let pointsAfter = attacker.points - amount;

  if (heartsAfter < HEARTS_MIN) heartsAfter = HEARTS_MIN;

  game.addLog(`${attacker.name} attacks ${victim.name} on ${amount}`);

  game.setPlayerHearts(victimId, heartsAfter);

  if (heartsAfter === HEARTS_MIN) {
    game.setPlayerDie(victimId);
    game.addLog(`${victim.name} is killed by ${attacker.name}`);
    if (victim.points > POINTS_MIN) {
      pointsAfter = pointsAfter + victim.points;
      game.addLog(`${attacker.name} received ${victim.points} points`);
      game.setPlayerPoints(victimId, POINTS_MIN);
    }
  }

  game.setPlayerPoints(attackerId, pointsAfter);
}

function validate(attacker: Player, victim: Player, amount: i8): void {
  if (attacker.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (amount < FIRE_AMOUNT_MIN) {
    throw new Error('The provided fire amount is not valid');
  }
  if (attacker.points <= POINTS_MIN || attacker.points < amount) {
    throw new Error('Insufficient action points for this action');
  }
  const range = max(
    abs(attacker.position.x - victim.position.x),
    abs(attacker.position.y - victim.position.y),
  );
  if (attacker.range < range) {
    throw new Error('The provided fire amount is not within the range');
  }
}
