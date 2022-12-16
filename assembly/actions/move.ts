import { POINTS_MIN } from '../constants';
import { Place, Player, PlayerID } from '../models';
import { Game } from '../state';

/**
 * Moves a player to a new position in a game
 *
 * @param {Game} game - The game object
 * @param {PlayerID} playerId - The id of the player to move
 * @param {i8} x - The x-coordinate of the new position
 * @param {i8} y - The y-coordinate of the new position
 * @throws {Error} If the player is not found in the game, the position is occupied, or if the action is invalid
 */
export function move(game: Game, playerId: PlayerID, x: i8, y: i8): void {
  const to = new Place(x, y);
  const player = game.getPlayer(playerId);

  validate(player);

  if (game.isPositionOccupied(x, y)) {
    throw new Error('This position is unavailable for movement');
  }

  const distance = max(
    abs(player.position.x - to.x),
    abs(player.position.y - to.y),
  );
  const pointsAfter = player.points - distance;

  if (pointsAfter < POINTS_MIN) {
    throw new Error('Insufficient action points for this action');
  }

  game.addLog(`${player.name} moves on [${to.x},${to.y}]`);

  game.setPlayerPoints(playerId, pointsAfter);
  game.setPlayerPosition(playerId, to.x, to.y);
}

function validate(player: Player): void {
  if (player.nextRound) {
    throw new Error('Cannot take action until the next round begins');
  }
  if (player.points <= POINTS_MIN) {
    throw new Error('Insufficient action points for this action');
  }
}
