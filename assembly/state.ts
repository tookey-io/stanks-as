import {
  AppearPoint,
  DissolveHeart,
  DissolvePoint,
  FloatingPoint,
  Place,
  Player,
  PlayerID,
  PlayerJSON,
  Tracing,
  UnattachedPoint,
} from './models';

export class GameState {
  players: PlayerJSON[] = [];
}

export class Game {
  players: Map<PlayerID, Player> = new Map();
  log: Set<string> = new Set();
  tracings: Set<Tracing> = new Set();
  appearPoints: Set<AppearPoint> = new Set();
  dissolvePoints: Set<DissolvePoint> = new Set();
  floatingPoints: Set<FloatingPoint> = new Set();
  dissolveHearts: Set<DissolveHeart> = new Set();

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
    this.tracings = new Set();
    this.appearPoints = new Set();
    this.dissolvePoints = new Set();
    this.floatingPoints = new Set();
    this.dissolveHearts = new Set();
  }

  addLog(msg: string): void {
    this.log.add(msg);
  }

  addPlayer(player: Player): void {
    this.players.set(player.name, player);
  }

  addTracePath(from: PlayerID, to: PlayerID, power: i32): void {
    if (this.players.has(from) && this.players.has(to)) {
      const tracing = new Tracing(
        this.players.get(from).position,
        this.players.get(to).position,
        power,
      );
      this.tracings.add(tracing);
    }
  }

  setPlayerHearts(playerId: PlayerID, hearts: i32): void {
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId);
      player.hearts = hearts;
      this.players.set(playerId, player);
    }
  }

  setPlayerRange(playerId: PlayerID, range: i32): void {
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId);
      player.range = range;
      this.players.set(playerId, player);
    }
  }

  addAppearPoint(at: Place, height: i32): void {
    const point = new AppearPoint(at, height);
    this.appearPoints.add(point);
  }

  setPlayerPosition(playerId: PlayerID, x: i32, y: i32): void {
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId);
      player.position = new Place(x, y);
      this.players.set(playerId, player);
    }
  }

  addDissolvePoint(at: Place, height: i32): void {
    const point = new DissolvePoint(at, height);
    this.dissolvePoints.add(point);
  }

  addFloatingPoint(from: UnattachedPoint, to: UnattachedPoint): void {
    const point = new FloatingPoint(from, to);
    this.floatingPoints.add(point);
  }

  setPlayerPoints(playerId: PlayerID, points: i32): void {
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId);
      player.points = points;
      this.players.set(playerId, player);
    }
  }
}
