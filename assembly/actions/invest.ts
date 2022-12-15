import { POINTS_MIN, RANGE_MAX } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

const INVEST_AMOUNT_MIN: i8 = 1;

export function invest(game: Game, playerId: PlayerID, amount: i8): void {
  const player = game.players.get(playerId);

  if (!player || amount < INVEST_AMOUNT_MIN || player.points <= POINTS_MIN) {
    // bad request
    return;
  }

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

  game.addLog(`${playerId} increases range on ${investAmount}`);

  game.setPlayerRange(playerId, rangeAfter);
  game.setPlayerPoints(playerId, pointsAfter);
}
