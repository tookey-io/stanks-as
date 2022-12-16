import { Player, PlayerID } from '../models';
import { Game } from '../state';

export function vote(game: Game, playerId: PlayerID, sign: string): void {
  const player = game.getPlayer(playerId);

  validate(player, sign);

  game.addLog(`${player.name} got vote`);

  game.setPlayerPoints(player.id, player.points + 1);
}

function validate(player: Player, sign: string): void {
  if (!sign || !isValidSignature(sign)) {
    throw new Error('Signature validation failed');
  }
}

function isValidSignature(sign: string): boolean {
  return true;
}
