import uuid from 'as-uuid/assembly/uuid';

export type PlayerID = string;

export class Place {
  x: i8;
  y: i8;
  constructor(x: i8, y: i8) {
    this.x = x;
    this.y = y;
  }

  asArray(): number[] {
    return [this.x, this.y];
  }
}

export class PlayerJSON {
  id!: string;
  position!: number[];
  range!: number;
  hearts!: number;
  points!: number;
  name!: string;
  userpic!: string;
  nextRound!: boolean;
  died!: boolean;
}

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
    this.nextRound = false;
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
