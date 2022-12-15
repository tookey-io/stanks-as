import { INVEST_AMOUNT_MIN, POINTS_MIN, RANGE_MAX } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

export function invest(game: Game, playerId: PlayerID, amount: i8): void {
  const player = game.players.get(playerId);

  validate(player, amount);

  let investAmount = amount;
  if (player.points < investAmount) {
    // then use all action points
    investAmount = player.points;
  }

  let rangeAfter = player.range + investAmount;
  if (rangeAfter > RANGE_MAX) {
    // then set max range and reduce invest amount
    rangeAfter = RANGE_MAX;
    investAmount = RANGE_MAX - player.range;
  }

  const pointsAfter = player.points - investAmount;

  game.addLog(`${player.name} increases range on ${investAmount}`);

  game.setPlayerRange(playerId, rangeAfter);
  game.setPlayerPoints(playerId, pointsAfter);
}

function validate(player: Player, amount: i8): void {
  if (!player) throw new Error('Player not found!');
  if (player.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (player.points <= POINTS_MIN) {
    throw new Error('Insufficient action points for this action');
  }
  if (amount < INVEST_AMOUNT_MIN) {
    throw new Error('The provided invest amount is not valid');
  }
}
