import { POINTS_MIN } from '../constants';
import { PlayerID } from '../models';
import { Game } from '../state';

export function share(
  game: Game,
  fromId: PlayerID,
  toId: PlayerID,
  amount: i32,
): void {
  const sender = game.players.get(fromId);
  const receiver = game.players.get(toId);

  const senderAfter = sender.points - amount;
  const receiverAfter = receiver.points + amount;

  if (senderAfter < POINTS_MIN) {
    return;
  }

  game.addLog(`${fromId} shares ${amount} to ${toId}`);

  game.setPlayerPoints(sender.name, senderAfter);
  game.setPlayerPoints(receiver.name, receiverAfter);
}
