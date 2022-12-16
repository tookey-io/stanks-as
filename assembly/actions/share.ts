import { POINTS_MIN, SHARE_AMOUNT_MIN } from '../constants';
import { Player, PlayerID } from '../models';
import { Game } from '../state';

export function share(
  game: Game,
  fromId: PlayerID,
  toId: PlayerID,
  amount: i8,
): void {
  const sender = game.players.get(fromId);
  const receiver = game.players.get(toId);

  validate(sender, receiver, amount);

  const senderAfter = sender.points - amount;
  const receiverAfter = receiver.points + amount;

  game.addLog(`${sender.name} shares ${amount} to ${receiver.name}`);

  game.setPlayerPoints(sender.id, senderAfter);
  game.setPlayerPoints(receiver.id, receiverAfter);
}

function validate(sender: Player, receiver: Player, amount: i8): void {
  if (!sender) throw new Error('Sender not found!');
  if (!receiver) throw new Error('Receiver not found!');
  if (sender.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (amount < SHARE_AMOUNT_MIN) {
    throw new Error('The provided share amount is not valid');
  }
  if (sender.points <= POINTS_MIN || sender.points < amount) {
    throw new Error('Insufficient action points for this action');
  }
}
