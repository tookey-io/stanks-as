import { HEALTH_MIN, POINTS_MIN, RANGE_MAX, RANGE_MIN } from './constants';
import { Place, Player, PlayerID, PlayerJSON } from './models';

export class GameState {
  players: PlayerJSON[] = [];
}

export class Game {
  players: Map<PlayerID, Player> = new Map();
  log: Set<string> = new Set();

  get state(): GameState {
    const players = this.players
      .values()
      .map<PlayerJSON>((value) => value.toJSON());

    return {
      players,
    };
  }

  reset(): void {
    this.players = new Map();
    this.log = new Set();
  }

  addLog(msg: string): void {
    this.log.add(msg);
  }

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  setPlayerHearts(playerId: PlayerID, hearts: i8): void {
    if (!this.players.has(playerId) || hearts < HEALTH_MIN) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.hearts = hearts;
    this.players.set(playerId, player);
  }

  setPlayerRange(playerId: PlayerID, range: i8): void {
    if (!this.players.has(playerId) || range < RANGE_MIN || range > RANGE_MAX) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.range = range;
    this.players.set(playerId, player);
  }

  setPlayerPosition(playerId: PlayerID, x: i8, y: i8): void {
    if (!this.players.has(playerId)) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.position = new Place(x, y);
    this.players.set(playerId, player);
  }

  setPlayerPoints(playerId: PlayerID, points: i8): void {
    if (!this.players.has(playerId) || points < POINTS_MIN) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.points = points;
    this.players.set(playerId, player);
  }
}
