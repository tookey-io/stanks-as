import { POINTS_MIN } from '../constants';
import { Place, Player, PlayerID } from '../models';
import { Game } from '../state';

export function move(game: Game, playerId: PlayerID, x: i8, y: i8): void {
  const to = new Place(x, y);
  const player = game.players.get(playerId);

  validate(player);
  // TODO: check place availability

  const distance = max(
    abs(player.position.x - to.x),
    abs(player.position.y - to.y),
  );
  const pointsAfter = player.points - distance;

  if (pointsAfter < POINTS_MIN) {
    throw new Error(
      `The player does not have the required number of points for this action ${player.points} ${distance} ${pointsAfter}`,
    );
  }

  game.addLog(`${player.name} moves on [${to.x},${to.y}]`);

  game.setPlayerPoints(playerId, pointsAfter);
  game.setPlayerPosition(playerId, to.x, to.y);
}

function validate(player: Player): void {
  if (!player) throw new Error('Player not found!');
  if (player.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (player.points <= POINTS_MIN) {
    throw new Error('Insufficient action points for this action');
  }
}
