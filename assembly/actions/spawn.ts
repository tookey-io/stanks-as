import { HEALTH_START, POINTS_START, RANGE_START } from '../constants';
import { Place, Player } from '../models';
import { Game } from '../state';

export function spawn(
  game: Game,
  x: i32,
  y: i32,
  name: string,
  userpic: string,
): void {
  const place = new Place(x, y);
  const player = new Player(
    place,
    POINTS_START,
    HEALTH_START,
    RANGE_START,
    name,
    userpic,
  );

  game.addLog(`Spawn ${player.name}`);

  game.addAppearPoint(place, 0);
  game.addPlayer(player);
}
