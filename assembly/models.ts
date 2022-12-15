import { genUUID } from './utils';

export type PlayerID = string;

export class Place {
  x: i32;
  y: i32;
  constructor(x: i32, y: i32) {
    this.x = x;
    this.y = y;
  }

  asArray(): number[] {
    return [this.x, this.y];
  }
}

export class Tracing {
  uuid: string;
  from: Place;
  to: Place;
  power: i32;
  constructor(from: Place, to: Place, power: i32) {
    this.uuid = genUUID();
    this.from = from;
    this.to = to;
    this.power = power;
  }
}

export class UnattachedPoint {
  at: Place;
  height: i32;
  constructor(at: Place, height: i32) {
    this.at = at;
    this.height = height;
  }
}

export class FloatingPoint {
  from: UnattachedPoint;
  to: UnattachedPoint;
  constructor(from: UnattachedPoint, to: UnattachedPoint) {
    this.from = from;
    this.to = to;
  }
}

export class DissolvePoint extends UnattachedPoint {}

export class AppearPoint extends UnattachedPoint {}

export class DissolveHeart {
  owner: PlayerID;
  constructor(owner: PlayerID) {
    this.owner = owner;
  }
}

export class PlayerJSON {
  position: number[] = [0, 0];
  range: number = 0;
  hearts: number = 0;
  points: number = 0;
  name: string = '';
  userpic: string | null = null;
}

export class Player {
  position: Place;
  points: i32;
  hearts: i32;
  range: i32;
  name: PlayerID;
  userpic: string;
  constructor(
    position: Place,
    points: i32,
    hearts: i32,
    range: i32,
    name: PlayerID,
    userpic: string,
  ) {
    this.position = position;
    this.points = points;
    this.hearts = hearts;
    this.range = range;
    this.name = name;
    this.userpic = userpic;
  }

  toJSON(): PlayerJSON {
    return {
      position: this.position.asArray(),
      range: this.range,
      hearts: this.hearts,
      points: this.points,
      name: this.name,
      userpic: this.userpic,
    };
  }
}
