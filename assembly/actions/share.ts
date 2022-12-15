import { POINTS_MIN } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

const SHARE_AMOUNT_MIN: i8 = 1;

export function share(
  game: Game,
  fromId: PlayerID,
  toId: PlayerID,
  amount: i8,
): void {
  const sender = game.players.get(fromId);
  const receiver = game.players.get(toId);

  if (
    !sender ||
    !receiver ||
    amount < SHARE_AMOUNT_MIN ||
    sender.points <= POINTS_MIN
  ) {
    // bad request
    return;
  }

  let shareAmount = amount;
  if (sender.points < shareAmount) {
    // then use all action points
    shareAmount = sender.points;
  }

  const senderAfter = sender.points - shareAmount;
  const receiverAfter = receiver.points + amount;

  game.addLog(`${fromId} shares ${amount} to ${toId}`);

  game.setPlayerPoints(sender.id, senderAfter);
  game.setPlayerPoints(receiver.id, receiverAfter);
}
