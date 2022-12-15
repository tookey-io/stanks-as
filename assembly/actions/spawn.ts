import { HEALTH_START, POINTS_START, RANGE_START } from '../constants';
import { Place, Player, PlayerJSON } from '../models';
import { Game } from '../state';

export function spawn(
  game: Game,
  x: i8,
  y: i8,
  name: string,
  userpic: string,
): PlayerJSON {
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

  game.addPlayer(player);

  return player.toJSON();
}
