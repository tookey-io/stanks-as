import { POINTS_MIN } from '../constants';
import { Place, PlayerID } from '../models';
import { Game } from '../state';

export function move(game: Game, playerId: PlayerID, x: i8, y: i8): void {
  const to = new Place(x, y);
  const player = game.players.get(playerId);

  if (!player || player.points <= POINTS_MIN) {
    // bad request
    return;
  }

  // todo: check place availability

  const distance = max(
    abs(player.position.x - to.x),
    abs(player.position.y - to.y),
  );
  const pointsAfter = player.points - distance;

  if (pointsAfter < POINTS_MIN) {
    // insufficient action points
    return;
  }

  game.addLog(`${playerId} moves on [${to.x},${to.y}]`);

  game.setPlayerPoints(playerId, pointsAfter);
  game.setPlayerPosition(playerId, to.x, to.y);
}
