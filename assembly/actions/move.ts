import { POINTS_MIN } from '../constants';
import { Place, PlayerID } from '../models';
import { Game } from '../state';

export function move(game: Game, whoId: PlayerID, x: i32, y: i32): void {
  const to = new Place(x, y);
  const player = game.players.get(whoId);

  const distance = max(
    abs(player.position.x - to.x),
    abs(player.position.y - to.y),
  );
  const pointsAfter = player.points - distance;

  if (pointsAfter < POINTS_MIN) {
    return;
  }

  game.addLog(`${whoId} moves on [${to.x},${to.y}]`);

  game.setPlayerPoints(whoId, pointsAfter);
  game.setPlayerPosition(whoId, to.x, to.y);
}
