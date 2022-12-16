import { HEARTS_START, POINTS_START, RANGE_START } from '../constants';
import { Place, Player, PlayerJSON } from '../models';
import { Game } from '../state';

/**
 * Spawns a new player in a game
 *
 * @param {Game} game - The game object
 * @param {i8} x - The x-coordinate of the player's position
 * @param {i8} y - The y-coordinate of the player's position
 * @param {string} name - The name of the player
 * @param {string} userpic - The URL of the player's avatar image
 * @returns {PlayerJSON} The new player object in JSON format
 * @throws {Error} If the position is occupied
 */
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
    HEARTS_START,
    RANGE_START,
    name,
    userpic,
  );

  game.addLog(`Spawn ${player.name}`);

  game.addPlayer(player);

  return player.toJSON();
}
