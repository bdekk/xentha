export class Game {
  id: number;
  name: string = '';
  url: string

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
