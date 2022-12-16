import { INVEST_AMOUNT_MIN, POINTS_MIN, RANGE_MAX } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

/**
 * Increases the range of a player in a game
 *
 * @param {Game} game - The game object
 * @param {PlayerID} playerId - The id of the player to invest
 * @param {i8} amount - The amount to invest
 * @throws {Error} If the player is not found in the game, or if the action is invalid
 */
export function invest(game: Game, playerId: PlayerID, amount: i8): void {
  const player = game.getPlayer(playerId);

  validate(player, amount);

  let investAmount = amount;
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
  if (player.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (amount < INVEST_AMOUNT_MIN) {
    throw new Error('The provided invest amount is not valid');
  }
  if (player.points <= POINTS_MIN || player.points < amount) {
    throw new Error('Insufficient action points for this action');
  }
}
