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

/**
 * Game is a class that represents the game state of a Stanks game
 *
 * @export
 * @class Game
 */
export class Game {
  /**
   * The Set containing the rounds that have been played
   *
   * @type {Set<string>}
   * @memberof Game
   */
  rounds: Set<string> = new Set();

  /**
   * The ID of the player who won the game, or null if the game is not over
   *
   * @type {(PlayerID | null)}
   * @memberof Game
   */
  winner: PlayerID | null = null;

  /**
   * Map of players in the game, with their IDs as the keys
   *
   * @type {Map<PlayerID, Player>}
   * @memberof Game
   */
  players: Map<PlayerID, Player> = new Map();

  /**
   * Set of player IDs that have been eliminated from the game
   *
   * @type {Set<PlayerID>}
   * @memberof Game
   */
  playersEliminated: Set<PlayerID> = new Set();

  /**
   * Timestamp for when the current round started
   *
   * @type {i64}
   * @memberof Game
   */
  roundStartAt: i64;

  /**
   * The duration of each round in the game, in milliseconds
   *
   * @type {i32}
   * @memberof Game
   */
  roundDuration: i32;

  /**
   * The minimum number of players required for the game to start
   *
   * @type {i8}
   * @memberof Game
   */
  minPlayers: i8;

  /**
   * Map of log messages, with their timestamps as the keys
   *
   * @type {Map<string, string>}
   * @memberof Game
   */
  log: Map<string, string> = new Map();

  /**
   * Creates an instance of Game.
   *
   * @param {GameConstructor} options Options for creating the game
   * @memberof Game
   */
  constructor(options: GameConstructor) {
    this.roundStartAt = options.roundStartAt;
    this.minPlayers = options.minPlayers;
    this.roundDuration = options.roundDuration;
  }

  /**
   * Returns the current state of the game
   *
   * @readonly
   * @type {GameState}
   * @memberof Game
   */
  get state(): GameState {
    const players = this.players
      .values()
      .map<PlayerJSON>((value) => value.toJSON());

    const logs = this.getLog();

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

  /**
   * Returns whether the game has started
   *
   * @readonly
   * @type {boolean}
   * @memberof Game
   */
  get gameStarted(): boolean {
    return this.currentRound > 0;
  }

  /**
   * Returns the number of players in the game, not including eliminated players
   *
   * @readonly
   * @type {i8}
   * @memberof Game
   */
  get playersCount(): i8 {
    return ((this.players.size as i8) - this.playersEliminated.size) as i8;
  }

  /**
   * Returns the current round number
   *
   * @readonly
   * @type {i8}
   * @memberof Game
   */
  get currentRound(): i8 {
    return this.rounds.size as i8;
  }

  /**
   * Returns the time remaining in the current round, in milliseconds
   *
   * @readonly
   * @type {i64}
   * @memberof Game
   */
  get timeLeftInRound(): i64 {
    const timeDiff = this.roundStartAt + this.roundDuration - Date.now();
    return timeDiff > 0 ? timeDiff : 0;
  }

  /**
   * Returns the set of player IDs that have been eliminated and now serve as a jury
   *
   * @readonly
   * @type {Set<PlayerID>}
   * @memberof Game
   */
  get jury(): Set<PlayerID> {
    return this.playersEliminated;
  }

  /**
   * Resets the game to its initial state
   *
   * @memberof Game
   */
  reset(): void {
    this.rounds = new Set();
    this.winner = null;
    this.players = new Map();
    this.playersEliminated = new Set();
    this.clearLog();
  }

  /**
   * Starts the next round of the game
   *
   * @throws {Error} If the game has already ended, or if there are not enough players to start the game
   * @memberof Game
   */
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
          this.confirmMove(player.id, false);
        }
      }
    }
  }

  /**
   * Adds a log message to the game's log
   *
   * @param {string} message - The log message to add
   * @memberof Game
   */
  addLog(message: string): void {
    this.log.set(`${this.log.size}-${Date.now()}`, message);
  }

  /**
   * Gets the game's log messages
   *
   * @returns {string[]} The log messages
   * @memberof Game
   */
  getLog(): string[] {
    return this.log.values();
  }

  /**
   * Removes all log messages from the game's log
   *
   * @memberof Game
   */
  clearLog(): void {
    this.log = new Map();
  }

  /**
   * Adds a player to the game
   *
   * @param {Player} player - The player to add
   * @throws {Error} If the player has already been added to the game
   * @memberof Game
   */
  addPlayer(player: Player): void {
    if (this.gameStarted) {
      throw new Error('Cannot add players after the game has started');
    }

    this.players.set(player.id, player);
  }

  /**
   * Removes a player from the game
   *
   * @param {PlayerID} playerId - The ID of the player to remove
   * @throws {Error} If the player is not in the game
   * @memberof Game
   */
  removePlayer(playerId: PlayerID): void {
    if (!this.players.has(playerId)) throw new Error('Player not found!');
    if (this.gameStarted) {
      throw new Error('Cannot remove players after the game has started');
    }

    this.players.delete(playerId);
  }

  /**
   * Gets the player with the given ID
   *
   * @param {PlayerID} playerId - The ID of the player to get
   * @returns {Player} The player with the given ID
   * @throws {Error} If the player is not in the game
   * @memberof Game
   */
  getPlayer(playerId: PlayerID): Player {
    if (!this.players.has(playerId)) throw new Error('Player not found!');

    return this.players.get(playerId);
  }

  /**
   * Gets the place of a player in the game
   *
   * @param {PlayerID} playerId - The ID of the player to get the place for
   * @returns {string} The place of the player in the game
   * @throws {Error} If the player is not in the game
   * @memberof Game
   */
  getPlace(playerId: PlayerID): string {
    const player = this.getPlayer(playerId);
    const players = this.players
      .values()
      .filter((p) => !p.died)
      .sort((a, b) => b.points - a.points);

    const place = players.findIndex((p) => p.id === player.id) + 1;
    const suffix = place % 10 === 1 ? 'st' : place % 10 === 2 ? 'nd' : 'th';

    return `${place}${suffix}`;
  }

  /**
   * Gets the player with the highest number of points
   *
   * @returns {Player} The player with the highest number of points
   * @memberof Game
   */
  getLeader(): Player {
    const players = this.players
      .values()
      .filter((player) => !player.died)
      .sort((a, b) => a.points - b.points);

    return players[0];
  }

  /**
   * Confirms or resets a player's move for the current round
   *
   * @param {PlayerID} playerId - The ID of the player
   * @param {boolean} confirm - Whether to confirm or reset the player's move
   * @throws {Error} If the player is not in the game
   * @memberof Game
   */
  confirmMove(playerId: PlayerID, confirm: boolean): void {
    const player = this.getPlayer(playerId);

    player.nextRound = confirm;
    this.players.set(playerId, player);
    if (confirm) this.addLog(`${player.name} has confirmed their move`);
  }

  /**
   * Sets the number of hearts for a player
   *
   * @param {PlayerID} playerId - The ID of the player
   * @param {i8} hearts - The number of hearts to set
   * @throws {Error} If the provided hearts amount is not valid
   * @memberof Game
   */
  setPlayerHearts(playerId: PlayerID, hearts: i8): void {
    if (hearts < HEARTS_MIN) {
      throw new Error('The provided hearts amount is not valid');
    }

    const player = this.getPlayer(playerId);
    player.hearts = hearts;
    this.players.set(playerId, player);
  }

  /**
   * Sets the range for a player
   *
   * @param {PlayerID} playerId - The ID of the player
   * @param {i8} range - The range to set
   * @throws {Error} If the provided range amount is not valid
   * @memberof Game
   */
  setPlayerRange(playerId: PlayerID, range: i8): void {
    if (range < RANGE_MIN || range > RANGE_MAX) {
      throw new Error('The provided range amount is not valid');
    }

    const player = this.getPlayer(playerId);
    player.range = range;
    this.players.set(playerId, player);
  }

  /**
   * Sets the position for a player
   *
   * @param {PlayerID} playerId - The ID of the player
   * @param {i8} x - The x-coordinate of the position
   * @param {i8} y - The y-coordinate of the position
   * @memberof Game
   */
  setPlayerPosition(playerId: PlayerID, x: i8, y: i8): void {
    const player = this.getPlayer(playerId);
    player.position = new Place(x, y);
    this.players.set(playerId, player);
  }

  /**
   * Sets the points for a player
   *
   * @param {PlayerID} playerId - The ID of the player
   * @param {i8} points - The number of points to set
   * @throws {Error} If the provided action points amount is not valid
   * @memberof Game
   */
  setPlayerPoints(playerId: PlayerID, points: i8): void {
    if (points < POINTS_MIN) {
      throw new Error('The provided action points amount is not valid');
    }

    const player = this.getPlayer(playerId);
    player.points = points;

    this.players.set(playerId, player);

    // confirm move automatically
    if (player.points === POINTS_MIN) {
      this.confirmMove(playerId, true);
    }
  }

  /**
   * Sets a player as "dead"
   *
   * @param {PlayerID} playerId - The ID of the player
   * @memberof Game
   */
  setPlayerDie(playerId: PlayerID): void {
    const player = this.getPlayer(playerId);
    player.died = true;
    this.players.set(playerId, player);
    this.playersEliminated.add(playerId);
  }

  /**
   * Checks if a position is occupied by a player
   *
   * @param {i8} x - The x coordinate of the position
   * @param {i8} y - The y coordinate of the position
   * @returns {boolean} Whether the position is occupied
   * @memberof Game
   */
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
