import uuid from 'as-uuid/assembly/uuid';

import { HEARTS_MIN, POINTS_MIN, RANGE_MAX, RANGE_MIN } from './constants';
import { Place, Player, PlayerID, PlayerJSON } from './models';

export class GameState {
  gameStarted!: boolean;
  currentRound!: i8;
  roundStartAt!: string;
  timeLeftInRound!: string;
  players!: PlayerJSON[];
  winner!: PlayerID | null;
  logs!: string[];
}

export class GameConstructor {
  minPlayers!: i8;
  roundDuration!: i32;
  roundStartAt!: i64;
}

export class Game {
  rounds: Set<string> = new Set();
  winner: PlayerID | null = null;

  players: Map<PlayerID, Player> = new Map();
  playersEliminated: Set<PlayerID> = new Set();

  roundStartAt: i64;
  roundDuration: i32;
  minPlayers: i8;

  log: Map<string, string> = new Map();

  constructor(options: GameConstructor) {
    this.roundStartAt = options.roundStartAt;
    this.minPlayers = options.minPlayers;
    this.roundDuration = options.roundDuration;
  }

  get state(): GameState {
    const players = this.players
      .values()
      .map<PlayerJSON>((value) => value.toJSON());

    const logs = this.log.values();

    return {
      gameStarted: this.gameStarted,
      currentRound: this.currentRound,
      roundStartAt: this.roundStartAt.toString(),
      timeLeftInRound: this.timeLeftInRound.toString(),
      players,
      winner: this.winner,
      logs,
    };
  }

  get gameStarted(): boolean {
    return this.currentRound > 0;
  }

  get playersCount(): i8 {
    return ((this.players.size as i8) - this.playersEliminated.size) as i8;
  }

  get currentRound(): i8 {
    return this.rounds.size as i8;
  }

  get timeLeftInRound(): i64 {
    const timeDiff = this.roundStartAt + this.roundDuration - Date.now();
    return timeDiff > 0 ? timeDiff : 0;
  }

  get jury(): Set<PlayerID> {
    return this.playersEliminated;
  }

  reset(): void {
    this.rounds = new Set();
    this.winner = null;
    this.players = new Map();
    this.playersEliminated = new Set();
    this.log = new Map();
  }

  startNextRound(): void {
    if (!this.gameStarted && this.playersCount < this.minPlayers) {
      throw new Error(
        [
          'Waiting for more players to join before starting the game.',
          `Currently, ${this.playersCount} of the required ${this.minPlayers} players have joined`,
        ].join(' '),
      );
    }

    if (this.winner) {
      throw new Error('The game has ended');
    }

    if (this.playersCount === 1 && !this.winner) {
      const winner = this.players.values().filter((player) => !player.died);
      this.winner = winner[0].id;
      this.addLog(`The winner is ${winner[0].name}`);
      return;
    }

    const allPlayersNextRound = this.players
      .values()
      .every((player) => player.nextRound || player.died);

    if (allPlayersNextRound || this.timeLeftInRound === 0) {
      this.rounds.add(uuid());
      this.roundStartAt = Date.now();

      this.addLog(`Round ${this.currentRound} has started`);

      const players = this.players.values();
      for (let i = 0; i < players.length; ++i) {
        const player = players[i];
        // Points are not awarded to users who do not confirm the completion of their move
        if (player.nextRound) {
          this.setPlayerPoints(player.id, player.points + 1);
          this.setPlayerRound(player.id, false);
        }
      }
    }
  }

  addLog(msg: string): void {
    this.log.set(`${this.log.size}-${Date.now()}`, msg);
  }

  addPlayer(player: Player): void {
    if (this.gameStarted) {
      throw new Error('Cannot add players after the game has started');
    }

    this.players.set(player.id, player);
  }

  removePlayer(playerId: PlayerID): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');
    if (this.gameStarted) {
      throw new Error('Cannot remove players after the game has started');
    }

    this.players.delete(playerId);
  }

  setPlayerHearts(playerId: PlayerID, hearts: i8): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');
    if (hearts < HEARTS_MIN) {
      throw new Error('The provided hearts amount is not valid');
    }

    const player = this.players.get(playerId);
    player.hearts = hearts;
    this.players.set(playerId, player);
  }

  setPlayerRange(playerId: PlayerID, range: i8): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');
    if (range < RANGE_MIN || range > RANGE_MAX) {
      throw new Error('The provided range amount is not valid');
    }

    const player = this.players.get(playerId);
    player.range = range;
    this.players.set(playerId, player);
  }

  setPlayerPosition(playerId: PlayerID, x: i8, y: i8): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');

    const player = this.players.get(playerId);
    player.position = new Place(x, y);
    this.players.set(playerId, player);
  }

  setPlayerPoints(playerId: PlayerID, points: i8): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');
    if (points < POINTS_MIN) {
      throw new Error('The provided action points amount is not valid');
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
    if (!this.players.has(playerId)) throw new Error('Player not found!');

    const player = this.players.get(playerId);
    player.nextRound = round;
    this.players.set(playerId, player);
  }

  setPlayerDie(playerId: PlayerID): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');

    const player = this.players.get(playerId);
    player.died = true;
    this.players.set(playerId, player);
    this.playersEliminated.add(playerId);
  }

  isPositionOccupied(x: i8, y: i8): boolean {
    let isOccupied = false;
    const players = this.players.values();
    for (let i = 0; i < players.length; ++i) {
      const player = players[i];
      if (player.position.x === x && player.position.y === y) isOccupied = true;
    }
    return isOccupied;
  }
}
