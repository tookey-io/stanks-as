import uuid from 'as-uuid/assembly/uuid';

export type PlayerID = string;

/**
 * Represents a position on a 2D grid
 *
 * @property {i8} x - The x-coordinate of the position
 * @property {i8} y - The y-coordinate of the position
 */
export class Place {
  x: i8;
  y: i8;
  constructor(x: i8, y: i8) {
    this.x = x;
    this.y = y;
  }

  asArray(): i8[] {
    return [this.x, this.y];
  }
}

/**
 * Represents a player in JSON format
 *
 * @property {string} id - The id of the player
 * @property {i8[]} position - The position of the player as an array in the form [x, y]
 * @property {i8} range - The range of the player
 * @property {i8} hearts - The number of hearts the player has
 * @property {i8} points - The number of points the player has
 * @property {string} name - The name of the player
 * @property {string} userpic - The URL of the player's avatar image
 * @property {boolean} nextRound - Indicates whether the player is ready to move on to the next round
 * @property {boolean} died - Indicates whether the player has died
 */
export class PlayerJSON {
  id!: string;
  position!: i8[];
  range!: i8;
  hearts!: i8;
  points!: i8;
  name!: string;
  userpic!: string;
  nextRound!: boolean;
  died!: boolean;
}

/**
 * Represents a player in the game
 *
 * @property {PlayerID} id - The id of the player
 * @property {Place} position - The position of the player
 * @property {i8} points - The number of points the player has
 * @property {i8} hearts - The number of hearts the player has
 * @property {i8} range - The range of the player
 * @property {string} name - The name of the player
 * @property {string} userpic - The URL of the player's avatar image
 * @property {boolean} nextRound - Indicates whether the player is ready to move on to the next round
 * @property {boolean} died - Indicates whether the player has died
 */
export class Player {
  id: PlayerID;
  position: Place;
  points: i8;
  hearts: i8;
  range: i8;
  name: string;
  userpic: string;
  nextRound: boolean;
  died: boolean;

  constructor(
    position: Place,
    points: i8,
    hearts: i8,
    range: i8,
    name: string,
    userpic: string,
  ) {
    this.id = uuid();
    this.position = position;
    this.points = points;
    this.hearts = hearts;
    this.range = range;
    this.name = name;
    this.userpic = userpic;
    this.nextRound = true;
    this.died = false;
  }

  toJSON(): PlayerJSON {
    return {
      id: this.id,
      position: this.position.asArray(),
      range: this.range,
      hearts: this.hearts,
      points: this.points,
      name: this.name,
      userpic: this.userpic,
      nextRound: this.nextRound,
      died: this.died,
    };
  }
}
