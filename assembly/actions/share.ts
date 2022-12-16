import { POINTS_MIN, SHARE_AMOUNT_MIN } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

/**
 * Shares points between two players in a game
 *
 * @param {Game} game - The game object
 * @param {PlayerID} fromId - The id of the sender player
 * @param {PlayerID} toId - The id of the receiver player
 * @param {i8} amount - The amount of points to share
 * @throws {Error} If the sender or receiver is not found in the game, or if the action is invalid
 */
export function share(
  game: Game,
  fromId: PlayerID,
  toId: PlayerID,
  amount: i8,
): void {
  const sender = game.getPlayer(fromId);
  const receiver = game.getPlayer(toId);

  validate(sender, receiver, amount);

  const senderAfter = sender.points - amount;
  const receiverAfter = receiver.points + amount;

  game.addLog(`${sender.name} shares ${amount} to ${receiver.name}`);

  game.setPlayerPoints(sender.id, senderAfter);
  game.setPlayerPoints(receiver.id, receiverAfter);
}

function validate(sender: Player, receiver: Player, amount: i8): void {
  if (sender.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (amount < SHARE_AMOUNT_MIN) {
    throw new Error('The provided share amount is not valid');
  }
  if (sender.points <= POINTS_MIN || sender.points < amount) {
    throw new Error('Insufficient action points for this action');
  }
  const range = max(
    abs(sender.position.x - receiver.position.x),
    abs(sender.position.y - receiver.position.y),
  );
  if (sender.range < range) {
    throw new Error('The provided share amount is not within the range');
  }
}
