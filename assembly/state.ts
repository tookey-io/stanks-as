import { HEARTS_MIN, POINTS_MIN, RANGE_MAX, RANGE_MIN } from './constants';
import { Place, Player, PlayerID, PlayerJSON } from './models';

export class GameState {
  round!: i8;
  roundStartAt!: string;
  players!: PlayerJSON[];
}

export class Game {
  round: i8 = 0;
  roundStartAt: string = Date.now().toString();
  players: Map<PlayerID, Player> = new Map();
  log: Set<string> = new Set();

  get state(): GameState {
    const players = this.players
      .values()
      .map<PlayerJSON>((value) => value.toJSON());

    return {
      round: this.round,
      roundStartAt: this.roundStartAt,
      players,
    };
  }

  reset(): void {
    this.round = 0;
    this.players = new Map();
    this.log = new Set();
  }

  startNextRound(): void {
    const allPlayersNextRound = this.players
      .values()
      .every((player) => player.nextRound || player.died);

    if (!allPlayersNextRound) {
      return;
    }

    this.round = this.round + 1;
    this.players.values().forEach((player) => {
      this.setPlayerPoints(player.id, player.points + 1);
      this.setPlayerRound(player.id, false);
    });
  }

  addLog(msg: string): void {
    this.log.add(msg);
  }

  addPlayer(player: Player): void {
    if (this.round > 0) {
      return;
    }

    this.players.set(player.id, player);
  }

  setPlayerHearts(playerId: PlayerID, hearts: i8): void {
    if (!this.players.has(playerId) || hearts < HEARTS_MIN) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.hearts = hearts;
    this.players.set(playerId, player);

    if (player.hearts === HEARTS_MIN) {
      this.setPlayerDie(playerId);
    }
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

    // set next round automatically
    if (player.points === POINTS_MIN) {
      this.setPlayerRound(playerId, true);
    }
  }

  setPlayerRound(playerId: PlayerID, round: boolean): void {
    if (!this.players.has(playerId)) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.nextRound = round;
    this.players.set(playerId, player);
  }

  setPlayerDie(playerId: PlayerID): void {
    if (!this.players.has(playerId)) {
      // throw
      return;
    }

    const player = this.players.get(playerId);
    player.died = true;
    this.players.set(playerId, player);
  }
}
